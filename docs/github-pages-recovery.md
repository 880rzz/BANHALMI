# GitHub Pages deployment recovery

The BANHALMI production site is published from the protected `main` branch through GitHub Pages with **GitHub Actions** as the publishing source.

## Verified failure mode

On 2026-08-06 several different reviewed commits produced valid Pages artifacts. In every case, the GitHub Pages service kept the deployment in `deployment_queued` state. The official `actions/deploy-pages@v5` action contains a hard maximum timeout of `600000` milliseconds. Values above that limit are reduced to ten minutes, after which the action explicitly cancels the Pages deployment.

The full repository audit, Chromium regression suite, live-link audit and production-routing audit passed. This is therefore a GitHub Pages deployment-queue failure, not a repository build, artifact, route or application failure.

## Permanent recovery architecture

The repository includes a custom GitHub Actions workflow at `.github/workflows/pages.yml` that:

1. runs the complete static repository audit;
2. creates an immutable artifact from the reviewed commit;
3. excludes repository-only tests, tools, workflow files and internal documentation;
4. verifies the required English, Hungarian and German production entry points;
5. rejects symbolic links;
6. uploads the verified artifact through the official Pages artifact action;
7. passes the exact uploaded `artifact_id` to a repository-owned direct Pages API client;
8. obtains the same GitHub Actions OIDC token required by Pages;
9. binds `pages_build_version` to the verified commit SHA, matching the official Pages action;
10. polls the deployment status for up to 45 minutes; and
11. does not cancel a deployment when the local polling window expires.

The direct Pages API client is `tools/deploy-pages-api.mjs`. It calls the documented Pages deployment and status endpoints but contains no cancellation endpoint. The workflow has `contents: read`, `pages: write` and `id-token: write` permissions. It cannot commit, push or rewrite the source repository.

## Why the official deploy action is not used

The official deploy action is safe under normal Pages response times, but its fixed ten-minute maximum is unsuitable while the Pages backend leaves otherwise valid deployments in `deployment_queued` for longer. Its timeout handler cancels the server-side deployment, preventing GitHub from completing it later.

The repository-owned client separates local monitoring from server-side cancellation. A temporary GitHub queue delay may still make the workflow wait or eventually report a timeout, but the already-created Pages deployment remains active instead of being deleted.

## Operational rule

- Keep **Settings → Pages → Build and deployment → Source** set to **GitHub Actions**.
- Do not switch back to the generated branch deployment.
- Do not repeatedly create no-op commits to force new deployments.
- Do not add `actions/deploy-pages` back while its hard maximum remains `600000` milliseconds.
- Keep the previously successful production version active until a newer deployment reports `succeed`.
- Every deployment must use the verified commit SHA as its `pages_build_version`.
- If the API polling window expires, inspect the existing deployment before starting another run; the workflow intentionally does not cancel it.

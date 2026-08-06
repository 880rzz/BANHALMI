# GitHub Pages deployment recovery

The BANHALMI production site is published from the protected `main` branch through GitHub Pages.

## Verified failure mode

On 2026-08-06 the generated branch-publishing workflow successfully built and uploaded two different production artifacts from two different commit identifiers. In both cases, the GitHub Pages service kept the deployment in `deployment_queued` state until the official `actions/deploy-pages@v5` ten-minute timeout cancelled it.

The full repository audit, Chromium regression suite, live-link audit and production-routing audit all passed. This therefore represents a GitHub Pages service-queue failure, not a repository build, artifact, route or application failure.

## Permanent recovery architecture

The repository includes a custom GitHub Actions workflow at `.github/workflows/pages.yml` that:

1. runs the complete static repository audit;
2. creates an immutable artifact from the reviewed commit;
3. excludes repository-only tests, tools, workflow files and internal documentation;
4. verifies the required English, Hungarian and German production entry points;
5. rejects symbolic links;
6. uploads the verified artifact through the official Pages actions; and
7. allows a 30-minute Pages deployment window instead of the generated workflow's ten-minute default.

The workflow has `contents: read`, `pages: write` and `id-token: write` permissions. It cannot commit, push or rewrite the source repository.

## Activation

Before merging the custom workflow:

1. Open the BANHALMI repository on GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, change **Source** from **Deploy from a branch** to **GitHub Actions**.
4. Return to the prepared pull request and merge it only after all checks are green.
5. Verify the `Deploy production site to GitHub Pages` workflow and its `github-pages` environment deployment.

After the Source setting is changed, GitHub stops creating the generated branch-deployment workflow. The repository-owned workflow becomes the single Pages publishing path.

## Operational rule

Do not generate repeated no-op commits or repeatedly rerun a cancelled deployment for the same SHA. Keep the previously successful production version active until the custom workflow has completed successfully.

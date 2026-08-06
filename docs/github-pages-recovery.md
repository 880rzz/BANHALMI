# GitHub Pages deployment recovery

The BANHALMI production site is published from the protected `main` branch through GitHub Pages.

## Verified failure mode

On 2026-08-06 the generated Pages workflow successfully built and uploaded the production artifact, but the GitHub Pages service kept the deployment in `deployment_queued` state until the official `actions/deploy-pages@v5` ten-minute timeout cancelled it. A retry of the same workflow attempt was cancelled immediately because Pages identifies that deployment by the same commit SHA.

This was a GitHub Pages service-queue failure, not a repository build, audit, routing or browser-regression failure.

## Recovery contract

1. Do not repeatedly rerun a cancelled Pages deployment for the same commit SHA.
2. Confirm that the full repository audit, browser regression suite and production-routing audit are successful.
3. Create a new reviewed commit so Pages receives a new deployment identifier.
4. Verify the new Pages build and deploy jobs separately.
5. Keep the previously successful production version active until the new deployment is confirmed.

This operational record is intentionally documentation-only and does not change production routes, content, schema, pricing, forms or design.

# Git & GitHub Workflow

This document outlines the standard Git workflow for our team. The `main` branch is protected, which means **all code must be merged via a Pull Request (PR)**.

## Rule #1: Don't Touch `main`

Never commit or push code directly to the `main` branch. All work must be done on a separate "feature branch."

---

## 1. Start of Day: Sync Your Code

Before starting any new work, always get the latest code from the `main` branch.

```bash
# 1. Go to the main branch
git checkout main

# 2. Pull the latest updates
git pull origin main
```

## 2\. Start a New Task: Create a Branch

For every new feature or bugfix, create a new branch from `main`.

```bash
# 3. Create and switch to your new branch
# Format: <type>/<your-name>/<feature-name>

# Example for Nam:
git checkout -b feat/nam/auth-api

# Example for John:
git checkout -b feat/john/login-page
```

_Branch Types: `feat/` (feature), `fix/` (bugfix), `docs/` (documentation)_

## 3\. Do Your Work: Commit & Push

Work on your code in this new branch. Commit often and push your branch to GitHub.

```bash
# 4. Save your work locally
git add .
git commit -m "Your clear commit message (e.g., 'Add bcrypt hashing for passwords')"

# 5. Push your branch to the remote repository (GitHub)
# (Do this often to back up your work)
git push origin feat/nam/auth-api
```

## 4\. When Ready: Create a Pull Request (PR)

When your feature is complete and ready for review, create a Pull Request on GitHub.

1.  Go to the repository on GitHub.
2.  You will see a yellow banner for your recently pushed branch. Click **"Compare & pull request"**.
3.  Set the base branch to `main` and the compare branch to your feature branch.
4.  Write a clear title (e.g., `Feat: Add User Authentication API`).
5.  Write a brief description of what you did.
6.  Assign the other team member as a **Reviewer**.
7.  Click **"Create pull request"**.

## 5\. Review & Merge

This is a team effort.

- **As the Reviewer (e.g., John):**

  1.  Read the PR description.
  2.  Go to the **"Files changed"** tab to review the code.
  3.  Leave comments or questions if needed.
  4.  If it all looks good, click **"Review changes"** -\> **"Approve"**.

- **As the Author (e.g., Nam):**

  1.  Wait for approval.
  2.  Once approved, click the **"Merge pull request"** button.
  3.  Confirm the merge. Your code is now in `main`\!

## 6\. Clean Up

After your branch is merged, delete it to keep the repository clean.

1.  **On GitHub:** Click the **"Delete branch"** button that appears after merging.
2.  **On your local machine:**

    ```bash
    # Go back to main and get the newly merged code
    git checkout main
    git pull origin main

    # Delete your local feature branch
    git branch -d feat/nam/auth-api
    ```

Then, go back to Step 1 for your next task.

```

```

# GitHub Actions Workflows

This directory contains automated workflows for the React Animated Code project.

## Workflows

### 1. CI (Continuous Integration) - `ci.yml`

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**What it does:**
- Builds the project on Node.js 18.x and 20.x
- Runs TypeScript type checking
- Verifies all build artifacts are created correctly
- Reports bundle size
- Checks code formatting (if Prettier is configured)

**Status Badge:**
```markdown
![CI](https://github.com/tonytangdev/react-animated-code/workflows/CI/badge.svg)
```

---

### 2. Publish to npm - `publish.yml`

**Triggers:**
- When a new GitHub release is published
- Manual workflow dispatch (via GitHub UI)

**What it does:**
- Installs dependencies
- Builds the project
- Verifies build output
- Publishes to npm with provenance
- Creates a summary with install instructions

**Setup Required:** You need to configure an npm token (see below)

---

## Setup Instructions

### Setting up npm Publishing with Trusted Publishers (OIDC)

This project uses **npm Trusted Publishers** (also called Provenance), which is more secure than using npm tokens. No secrets needed!

1. **Create an npm Account**
   - Go to [npmjs.com](https://www.npmjs.com) and create an account
   - Verify your email address

2. **Configure Trusted Publishing on npm**
   - Log in to npm
   - Go to your package page (or create it with first manual publish)
   - Navigate to: Settings → Publishing Access
   - Click "Add Provider"
   - Select **GitHub Actions**
   - Fill in:
     - **GitHub Account**: `tonytangdev`
     - **Repository**: `react-animated-code`
     - **Workflow**: `publish.yml`
     - **Environment**: Leave blank (unless using environments)
   - Click "Add"

3. **Configure package.json**

   Ensure your `package.json` has:
   ```json
   {
     "name": "react-animated-code",
     "version": "0.1.0",
     "repository": {
       "type": "git",
       "url": "git+https://github.com/tonytangdev/react-animated-code.git"
     },
     "publishConfig": {
       "access": "public"
     }
   }
   ```

**That's it!** No npm tokens needed. GitHub Actions will authenticate automatically using OIDC.

---

## Publishing a New Version

### Automated Release (Recommended)

1. **Update version in package.json**
   ```bash
   npm version patch  # 0.1.0 → 0.1.1
   npm version minor  # 0.1.0 → 0.2.0
   npm version major  # 0.1.0 → 1.0.0
   ```

2. **Push the version commit and tag**
   ```bash
   git push && git push --tags
   ```

3. **Create a GitHub Release**
   - Go to your repository → Releases → "Create a new release"
   - Choose the tag you just pushed (e.g., `v0.1.1`)
   - Write release notes (what's new, what changed, breaking changes)
   - Click "Publish release"

4. **Automatic Publishing**
   - The `publish.yml` workflow will trigger automatically
   - Monitor progress in the Actions tab
   - Package will be published to npm with provenance

### Manual Publish (Alternative)

If you need to publish manually:

```bash
# 1. Ensure you're on main and up to date
git checkout main
git pull

# 2. Update version
npm version patch  # or minor/major

# 3. Build
npm run build

# 4. Publish
npm publish
```

---

## Workflow Best Practices

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (0.1.0 → 0.1.1): Bug fixes, minor changes
- **Minor** (0.1.0 → 0.2.0): New features (backward compatible)
- **Major** (0.1.0 → 1.0.0): Breaking changes

### Release Notes Template

```markdown
## What's Changed

### ✨ New Features
- Feature 1
- Feature 2

### 🐛 Bug Fixes
- Fix 1
- Fix 2

### 📝 Documentation
- Updated README with new examples

### ⚡ Performance
- Improved highlighter caching

### 💥 Breaking Changes
- **BREAKING:** Changed prop `foo` to `bar`
  - Migration: Replace `foo={value}` with `bar={value}`

**Full Changelog**: https://github.com/tonytangdev/react-animated-code/compare/v0.1.0...v0.2.0
```

---

## Troubleshooting

### Build Fails in CI

**Check:**
- Does it build locally? (`npm run build`)
- Are all dependencies in `package.json`?
- Are dev dependencies listed under `devDependencies`?

### Publish Fails - "401 Unauthorized" or "403 Forbidden"

**Causes:**
- Trusted Publisher not configured on npm
- Wrong repository/workflow name in npm settings
- Package doesn't exist yet (first publish must be manual)

**Fix:**
1. Go to npm package settings → Publishing Access
2. Verify GitHub Actions provider is configured correctly
3. Check repository name matches exactly: `tonytangdev/react-animated-code`
4. Check workflow name matches: `publish.yml`
5. For first publish, do it manually: `npm publish` (after logging in locally)

### Publish Fails - "Package already exists"

**Causes:**
- Version already published to npm
- Forgot to bump version

**Fix:**
1. Update version: `npm version patch`
2. Commit and push the version change
3. Create new release

### Type Check Fails

**Fix:**
```bash
# Run locally to see errors
npx tsc --noEmit

# Fix TypeScript errors
# Then commit and push
```

---

## Advanced Usage

### Manual Workflow Trigger

You can manually trigger the publish workflow:

1. Go to Actions tab
2. Select "Publish to npm" workflow
3. Click "Run workflow"
4. Optionally specify a version
5. Click "Run workflow" button

### Testing the Workflow Locally

Use [act](https://github.com/nektos/act) to test workflows locally:

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run CI workflow
act pull_request

# Note: Publishing workflow requires secrets, harder to test locally
```

---

## Monitoring

### Check Workflow Status

- **GitHub Actions tab**: See all workflow runs
- **Pull Requests**: See status checks at the bottom
- **Releases**: Verify publish succeeded after creating release

### npm Package Status

After publishing:
- Visit: https://www.npmjs.com/package/react-animated-code
- Verify version is updated
- Check provenance badge appears (📦 with checkmark)

---

## Security

### Best Practices

✅ **DO:**
- Use "Automation" tokens for CI/CD
- Store tokens in GitHub Secrets (never commit)
- Enable 2FA on your npm account
- Use `--provenance` flag when publishing
- Review workflow runs regularly

❌ **DON'T:**
- Commit npm tokens to git
- Share tokens publicly
- Use personal tokens for automation
- Disable security features

---

## Questions?

- **Workflow issues**: Check the Actions tab for error logs
- **npm issues**: Check npm documentation or contact npm support
- **General questions**: Open a discussion in the repository

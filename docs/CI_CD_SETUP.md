# CI/CD Setup Instructions

## 📋 Overview

GitHub Actions workflows have been created locally but cannot be automatically committed due to GitHub App permission restrictions.

## 📁 Files Created

Two workflow files exist locally in `.github/workflows/`:

1. **ci-cd.yml** - Main CI/CD Pipeline
2. **security.yml** - Security Scanning

## 🚀 Setup Options

### Option 1: Manual Commit (Recommended)

```bash
# Add the workflow files
git add .github/workflows/

# Commit
git commit -m "ci: add GitHub Actions workflows for CI/CD and security scanning"

# Push
git push
```

### Option 2: Grant Workflow Permissions

1. Go to repository settings
2. Navigate to Actions → General
3. Grant the GitHub App "workflows" permission
4. Then the workflows can be committed normally

## 📄 Workflow Details

### CI/CD Pipeline (ci-cd.yml)

**5-Stage Pipeline:**

1. **Lint & Type Check**
   - ESLint validation
   - TypeScript type checking
   - ~5 minutes

2. **Unit & Integration Tests**
   - Jest tests with coverage
   - 80% coverage threshold enforced
   - PostgreSQL & Redis services
   - ~10 minutes

3. **Build Applications**
   - Build frontend (Next.js)
   - Build backend (NestJS)
   - Upload artifacts
   - ~10 minutes

4. **E2E Tests**
   - Playwright tests
   - Chromium & Firefox
   - Screenshots on failure
   - ~15 minutes

5. **Deploy**
   - Deploy to Vercel (production)
   - Only on main branch
   - ~5 minutes

**Total Pipeline Time:** ~20 minutes

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Environment Variables Needed:**
```yaml
VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Security Scanning (security.yml)

**4 Security Checks:**

1. **Dependency Vulnerability Scan**
   - `pnpm audit` for production dependencies
   - Fails on critical vulnerabilities
   - ~5 minutes

2. **Code Security Analysis**
   - Trivy vulnerability scanner
   - SARIF format for GitHub Security
   - Critical & high severity issues
   - ~10 minutes

3. **Secret Scanning**
   - Gitleaks for exposed secrets
   - Full git history scan
   - Blocks commits with secrets
   - ~5 minutes

4. **License Compliance**
   - Check all dependency licenses
   - Summary report
   - ~5 minutes

**Total Security Scan Time:** ~25 minutes

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Scheduled: Every Monday at 9:00 AM UTC

## ✅ Verification

After committing the workflows:

1. Check Actions tab in GitHub repository
2. Workflows should appear in the list
3. Push a commit to trigger the pipeline
4. Monitor workflow runs

## 🔧 Configuration

### Coverage Threshold

Current requirement: **80% coverage** for all metrics (lines, branches, functions, statements)

To adjust, edit in `ci-cd.yml`:
```yaml
- name: Check coverage threshold (80%)
  run: |
    COVERAGE=$(node -e "console.log(require('./coverage/coverage-summary.json').total.lines.pct)")
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "❌ Coverage $COVERAGE% is below 80% threshold"
      exit 1
    fi
```

### Security Scanning

To adjust severity levels, edit in `security.yml`:
```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    severity: 'CRITICAL,HIGH'  # Adjust as needed
```

## 📝 Next Steps

1. Commit the workflow files (using Option 1 or 2 above)
2. Configure required secrets in repository settings
3. Test the pipeline with a test commit
4. Monitor first pipeline run
5. Adjust thresholds if needed

## 🔗 References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Actions](https://vercel.com/docs/deployments/git/vercel-for-github)
- [Trivy Scanner](https://github.com/aquasecurity/trivy-action)
- [Gitleaks](https://github.com/gitleaks/gitleaks-action)

---

**Created:** 2025-10-29
**Status:** Workflows ready, awaiting commit
**Action Required:** Manual commit or permission grant

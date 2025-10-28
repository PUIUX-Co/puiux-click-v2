# 🌿 Git Branching Strategy

## Overview

PUIUX Click uses a **simplified Git Flow** strategy optimized for continuous deployment and team collaboration.

---

## Branch Types

### 1. `main` (Production)

```
🔒 Protected Branch
├─ Always deployable
├─ Requires PR + approval
├─ Auto-deploy to production
└─ Tagged releases only
```

**Rules:**
- ✅ Always stable and production-ready
- ✅ Direct pushes NOT allowed
- ✅ All changes via Pull Requests
- ✅ Requires at least 1 approval
- ✅ All tests must pass
- ✅ Auto-deployed on merge

---

### 2. `develop` (Staging)

```
🔄 Integration Branch
├─ Latest development changes
├─ Auto-deploy to staging
├─ Feature branches merge here first
└─ Merge to main when stable
```

**Rules:**
- ✅ Integration point for features
- ✅ Auto-deploys to staging environment
- ✅ Should be stable (not experimental)
- ⚠️ May have minor bugs

---

### 3. `feature/*` (Features)

```
✨ Feature Development
├─ Branch from: develop
├─ Merge to: develop
├─ Naming: feature/description
└─ Delete after merge
```

**Examples:**
```bash
feature/wizard-builder
feature/chat-ai-mode
feature/payment-integration
feature/user-dashboard
```

**Workflow:**
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/wizard-builder

# Work on feature
git add .
git commit -m "feat(builder): add wizard step navigation"

# Push and create PR
git push -u origin feature/wizard-builder
# Create PR: feature/wizard-builder → develop
```

---

### 4. `fix/*` (Bug Fixes)

```
🐛 Bug Fixes
├─ Branch from: develop (or main for hotfixes)
├─ Merge to: develop (or main for hotfixes)
├─ Naming: fix/description
└─ Delete after merge
```

**Examples:**
```bash
fix/login-validation
fix/payment-webhook
fix/template-rendering
```

**Workflow:**
```bash
# Create fix branch
git checkout develop
git checkout -b fix/login-validation

# Fix the bug
git add .
git commit -m "fix(auth): resolve login validation issue"

# Push and create PR
git push -u origin fix/login-validation
```

---

### 5. `hotfix/*` (Production Hotfixes)

```
🚨 Emergency Fixes
├─ Branch from: main
├─ Merge to: main AND develop
├─ Naming: hotfix/description
└─ Delete after merge
```

**When to use:**
- Critical production bugs
- Security vulnerabilities
- Data loss prevention

**Workflow:**
```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-payment-bug

# Fix urgently
git add .
git commit -m "fix(payment): resolve critical payment processing bug"

# Merge to BOTH main and develop
git push -u origin hotfix/critical-payment-bug
# Create PR 1: hotfix/critical-payment-bug → main
# Create PR 2: hotfix/critical-payment-bug → develop
```

---

### 6. `release/*` (Release Preparation)

```
🚀 Release Branches
├─ Branch from: develop
├─ Merge to: main AND develop
├─ Naming: release/v2.1.0
└─ For version bumps, changelog, etc.
```

**Workflow:**
```bash
# Create release branch
git checkout develop
git checkout -b release/v2.1.0

# Prepare release
# - Update version in package.json
# - Update CHANGELOG.md
# - Run tests
# - Fix minor bugs

git commit -m "chore(release): prepare v2.1.0"

# Merge to main (production)
# Then merge back to develop
```

---

### 7. `docs/*` (Documentation)

```
📚 Documentation Updates
├─ Branch from: develop
├─ Merge to: develop
├─ Naming: docs/description
└─ Delete after merge
```

**Examples:**
```bash
docs/api-documentation
docs/setup-guide
docs/architecture-diagram
```

---

## Branch Naming Convention

### Format
```
<type>/<description>
```

### Types
- `feature/` - New features
- `fix/` - Bug fixes
- `hotfix/` - Production hotfixes
- `release/` - Release preparation
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions
- `chore/` - Maintenance tasks

### Description
- Use lowercase
- Use hyphens (kebab-case)
- Be descriptive but concise
- No spaces or special characters

**Good:**
```bash
feature/wizard-builder
fix/payment-validation
docs/api-endpoints
```

**Bad:**
```bash
feature/WizardBuilder
fix_payment
my-feature
test
```

---

## Workflow Diagrams

### Feature Development Flow

```
main     ──────────────────────────────────────►
           ▲                               ▲
           │                               │
develop   ─┴──────────────────────────────┴───►
           │                               │
           │ PR                           │ PR
           │                              │
feature   ─┴──────────────────────────────┘
           Create → Work → Push → PR → Merge
```

### Hotfix Flow

```
main     ────┬─────────────────────┬──────────►
             │                     │
             │ hotfix created      │ merged back
             │                     │
hotfix      ─┴─────────────────────┘
                   Fix urgently
```

---

## Commit Message Convention

We follow **Conventional Commits** specification.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Maintenance
- `ci`: CI/CD changes

### Examples

```bash
# Feature
feat(builder): add wizard step navigation

# Bug fix
fix(auth): resolve token expiration issue

# Documentation
docs(readme): update installation instructions

# Refactor
refactor(api): simplify user service logic

# Performance
perf(templates): optimize template rendering

# Breaking change
feat(api)!: change authentication flow

BREAKING CHANGE: Auth endpoints now require different headers
```

---

## Pull Request Process

### 1. Create PR

**Title Format:**
```
<type>(<scope>): <description>
```

**Example:**
```
feat(builder): add chat AI mode
```

### 2. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests passing
- [ ] Documentation updated
```

### 3. Review Process

1. **Automated Checks** (CI/CD)
   - Linting
   - Type checking
   - Tests
   - Build

2. **Code Review**
   - At least 1 approval required
   - Address all comments
   - No unresolved conversations

3. **Merge**
   - Use "Squash and merge"
   - Delete branch after merge
   - Auto-deploys to appropriate environment

---

## Deployment Flow

```
┌──────────┐
│  Commit  │
└────┬─────┘
     │
     ▼
┌──────────┐
│   Push   │
└────┬─────┘
     │
     ▼
┌──────────────┐
│  Create PR   │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│  CI/CD Run   │
│  (lint,test) │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│ Code Review  │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│    Merge     │
└────┬─────────┘
     │
     ├─────────────┬─────────────┐
     ▼             ▼             ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│ Staging │   │  Main   │   │  Prod   │
│ (dev)   │   │(release)│   │ (main)  │
└─────────┘   └─────────┘   └─────────┘
```

---

## Best Practices

### ✅ Do

1. **Keep branches short-lived**
   - Merge within 1-3 days
   - Break large features into smaller PRs

2. **Sync regularly**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-branch
   git rebase develop
   ```

3. **Write good commit messages**
   - Clear and descriptive
   - Follow conventional commits

4. **Test before pushing**
   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

5. **Keep PRs focused**
   - One feature/fix per PR
   - Easier to review
   - Faster to merge

### ❌ Don't

1. **Don't commit directly to main or develop**
   - Always use feature branches

2. **Don't merge without review**
   - Wait for approval
   - Address all comments

3. **Don't push broken code**
   - Ensure tests pass locally
   - Fix linting errors

4. **Don't create huge PRs**
   - Max ~500 lines changed
   - Split into smaller PRs

5. **Don't leave branches stale**
   - Merge or close old branches
   - Delete merged branches

---

## Git Commands Cheatsheet

```bash
# Create new branch
git checkout -b feature/my-feature

# Switch branches
git checkout develop

# Update current branch
git pull origin develop

# Rebase on develop
git rebase develop

# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push new branch
git push -u origin feature/my-feature

# Push updates
git push

# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature

# Stash changes
git stash
git stash pop

# View branches
git branch -a

# View status
git status

# View log
git log --oneline --graph
```

---

## Troubleshooting

### Merge Conflicts

```bash
# Update your branch with latest develop
git checkout develop
git pull origin develop
git checkout your-branch
git rebase develop

# Fix conflicts in files
# Then:
git add .
git rebase --continue

# Or abort:
git rebase --abort
```

### Wrong Branch

```bash
# Move commits to correct branch
git checkout correct-branch
git cherry-pick <commit-hash>

# Or use stash
git stash
git checkout correct-branch
git stash pop
```

### Undo Last Commit

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

---

## Protected Branches

### `main`
- ✅ Requires PR
- ✅ Requires 1 approval
- ✅ Status checks must pass
- ✅ No direct pushes
- ✅ No force pushes

### `develop`
- ✅ Requires PR
- ✅ Status checks must pass
- ⚠️ Can be bypassed by admins

---

## CI/CD Integration

On every push to a PR:

1. **Linting** - Code style check
2. **Type Check** - TypeScript validation
3. **Tests** - Unit + Integration
4. **Build** - Production build
5. **Deploy Preview** - Vercel preview URL

On merge to `develop`:
- Auto-deploy to **Staging**

On merge to `main`:
- Auto-deploy to **Production**
- Create GitHub Release
- Tag version

---

## Questions?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for more details.

---

**Last Updated:** 2025-10-28

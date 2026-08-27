/* Publie le contenu de dist/ sur la branche gh-pages.
   Usage : npm run deploy   (construit puis publie)                        */
import { execSync } from 'node:child_process'
import fs from 'node:fs'

const run = (c) => execSync(c, { stdio: 'inherit' })
const out = (c) => execSync(c, { encoding: 'utf8' }).trim()

if (!fs.existsSync('dist/index.html')) {
  console.error('dist/ absent — lancer `npm run build` d’abord.')
  process.exit(1)
}
// .nojekyll : sans lui, GitHub Pages ignore les dossiers commençant par _
fs.writeFileSync('dist/.nojekyll', '')

const branch = 'gh-pages'
const tmp = '.gh-pages-worktree'
const msg = `deploy ${out('git rev-parse --short HEAD')}`

try { run(`git worktree remove ${tmp} --force`) } catch { /* rien à retirer */ }

const exists = out(`git ls-remote --heads origin ${branch}`) !== ''
run(exists
  ? `git worktree add ${tmp} ${branch} 2>/dev/null || git worktree add -B ${branch} ${tmp} origin/${branch}`
  : `git worktree add -B ${branch} ${tmp}`)

run(`find ${tmp} -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +`)
run(`cp -R dist/. ${tmp}/`)
run(`cd ${tmp} && git add -A && (git diff --cached --quiet || git commit -m "${msg}") && git push origin ${branch}`)
run(`git worktree remove ${tmp} --force`)
console.log('\npublié sur la branche gh-pages')

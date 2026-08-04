[![Build and deploy site](https://github.com/jpanneton/jpanneton.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/jpanneton/jpanneton.github.io/actions/workflows/deploy.yml)

Personal blog at <https://jpanneton.dev>, built with Jekyll and the
[Chalk](https://github.com/nielsenramon/chalk) theme.

## Writing

Posts go in `_posts/` and need a date prefix:

```
2020-10-01-my-new-post.md
```

Drafts go in `_drafts/` and need no date:

```
my-new-draft.md
```

## Running locally

One-time setup (no Node needed):

```
bundle install
```

Then use the "Chalk: Serve" task in VS Code (Ctrl+Shift+B), or run it
directly, and open <http://localhost:4000/>:

```
bundle exec jekyll serve --drafts
```

## Publishing

Push to `main`. GitHub Actions builds the site and deploys it to GitHub
Pages; the badge above tracks the current state.

```
git push origin main
```

## Windows notes

Git Bash needs `bundle.cmd`; plain `bundle` hands `ruby.exe` a POSIX path and
fails with a `LoadError`. PowerShell and cmd are fine with `bundle`.

`--detach` relies on `fork()` and is unavailable.

Compiling native gems — only needed when gems change, e.g. `bundle install`
after editing the Gemfile — requires pointing gcc at the Ruby headers first.
mkmf emits MSYS-style `/C/...` include paths that the native compiler cannot
resolve, so set these in the shell beforehand:

```powershell
$env:CPATH = "C:/Ruby34-x64/include/ruby-3.4.0;C:/Ruby34-x64/include/ruby-3.4.0/x64-mingw-ucrt"
$env:LIBRARY_PATH = "C:/Ruby34-x64/lib"
```

Set them per-shell, not globally: `CPATH` applies to every gcc invocation and
would leak Ruby headers into unrelated C/C++ builds.

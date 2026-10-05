---
name: commit-message
description: Draft a short commit message from the current diff. Use when the user asks for a commit message.
disable-model-invocation: true
allowed-tools: Bash(git status *) Bash(git diff *)
---

Read `git status` and `git diff` (staged changes first, otherwise the working tree). Output exactly one commit message line in the imperative mood, at most about 72 characters, and nothing else. Never run `git commit` or `git push`.

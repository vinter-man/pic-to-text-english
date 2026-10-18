# Real terminal recording used in the README and inside the Remotion video.
# Run from demo/ after `uv sync` in the repo root:  vhs demo.tape

Output ../docs/terminal.gif
Output public/terminal.mp4

Set Shell "bash"
Set FontFamily "Menlo"
Set FontSize 22
Set Width 1400
Set Height 600
Set Padding 28
Set Theme "Catppuccin Mocha"
Set TypingSpeed 55ms
Set WindowBar Colorful
Set BorderRadius 12

Hide
Type `export PATH="$PWD/../.venv/bin:$PATH" PS1='\[\e[38;5;150m\]~/english\[\e[0m\] \[\e[38;5;245m\]$\[\e[0m\] '`
Enter
Type `D="$(mktemp -d)/english" && mkdir -p "$D" && cp -R ../examples/screenshots "$D/" && cd "$D" && clear`
Enter
Sleep 500ms
Show

Sleep 600ms
Type "ls screenshots"
Sleep 300ms
Enter
Sleep 1.6s
Type "pic2text"
Sleep 300ms
Enter
Wait+Screen@20s /Added/
Sleep 2.2s
Type "pic2text   # run it again any time"
Sleep 300ms
Enter
Wait+Screen@10s /up to date/
Sleep 2.5s

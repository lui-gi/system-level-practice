# Exam 1 Quizzes — Implementation Plan

Source material: slides/week_01 through slides/week_05, Exam 1 Study Guide (week_05_lec_02_Sp26_Exam_1_Study_Guide.pdf)

All quizzes go in `resources/exam1/`. Format: single-file HTML matching the existing style (Poppins font, teal accent `hsl(173,53%,19%)`, dark `<pre>` blocks with teal left border, `qz-wrap`/`qz-header`/`q-card` classes, MCQ buttons + trace textareas, self-contained inline CSS+JS). Reference file: `resources/exam2/loops-quiz.html`.

---

## Quiz 1 — `system-concepts-quiz.html`

**Topic:** System programming concepts, OS layers, APIs, system calls, system programs, daemons, pipes  
**Source:** week_01_lec_01, week_01_lec_02  
**Questions (10):**

| # | Type | Prompt | Answer |
|---|------|--------|--------|
| 1 | MCQ | Which of the following is NOT an example of system programming? | C) Developing a website |
| 2 | MCQ | Which layer lies between application programs and computer hardware? | B) Operating System |
| 3 | MCQ | What is an API in the context of system programming? | B) A collection of libraries provided by the OS for lower-level tasks |
| 4 | MCQ | Which of the following is NOT system software? | B) Missile control systems |
| 5 | MCQ | Which command records a terminal session? | A) script |
| 6 | MCQ | Which key combination terminates a running program? | A) Ctrl+C |
| 7 | MCQ | What does Ctrl+Z do (vs Ctrl+C)? | B) Suspends the process (sends it to background); Ctrl+C terminates it |
| 8 | MCQ | A system daemon is best described as: | B) A background process that runs continuously without user interaction |
| 9 | trace | Name one valid Unix pipe example using `who` and `sort`. | `who \| sort` |
| 10 | MCQ | Which of the following is a system call (not a library function)? | C) fork() |

---

## Quiz 2 — `unix-basics-quiz.html`

**Topic:** Common Unix utilities, paths, file/directory operations, terminal settings  
**Source:** week_01_lec_02, week_02_lec_01, week_02_lec_02, week_03_lec_01  
**Questions (10):**

| # | Type | Prompt | Answer |
|---|------|--------|--------|
| 1 | MCQ | What does `ls -a` do? | B) Lists all files including hidden ones |
| 2 | MCQ | Which command counts the number of lines in a file? | A) `wc -l file.txt` |
| 3 | MCQ | What does `rmdir dir` do if `dir` is not empty? | B) Fails with an error; use `rm -r dir` instead |
| 4 | MCQ | Which command views the current terminal settings? | A) `stty -a` |
| 5 | MCQ | What is the difference between `cat` and `more`? | B) `more` displays output one page at a time; `cat` dumps everything at once |
| 6 | MCQ | What does `cp -ir src/ dst/` do? | C) Recursively copies src/ to dst/, prompting before overwriting |
| 7 | trace | Write the command to rename `file1.txt` to `new.txt`. | `mv file1.txt new.txt` |
| 8 | MCQ | What does the `-r` flag do in `sftp> get -r remote_dir`? | B) Recursively downloads the entire remote directory |
| 9 | MCQ | An absolute path always starts with: | A) `/` |
| 10 | trace | Write the command to recursively remove a non-empty directory called `old/`. | `rm -r old/` |

---

## Quiz 3 — `unix-permissions-vi-quiz.html`

**Topic:** File permissions (rwx, chmod symbolic and octal), vi editor commands  
**Source:** week_02_lec_02, week_03_lec_01  
**Questions (10):**

| # | Type | Prompt | Answer |
|---|------|--------|--------|
| 1 | MCQ | In the permission string `r-xrwx--x`, what can "others" do? | C) Execute only |
| 2 | trace | Write the command to add write permission for the owner of `file.txt`. | `chmod u+w file.txt` |
| 3 | MCQ | What octal value gives user rwx, group r-x, others r-x? | B) 755 |
| 4 | trace | Write the chmod command (using octal) so only the user can read, write, execute, and group/others can only execute. | `chmod 711 file.txt` |
| 5 | MCQ | In vi, which command deletes lines 2 through 10? | B) `:2,10d` |
| 6 | MCQ | What does `3yy` do in vi? | A) Yanks (copies) 3 lines |
| 7 | MCQ | What does `:1,3t 10` do in vi? | B) Copies lines 1–3 and pastes them after line 10 |
| 8 | MCQ | In vi, which command saves and quits? | C) `:wq` |
| 9 | MCQ | Which vi command enters insert mode? | A) `i` |
| 10 | MCQ | What does `chmod 644 file.txt` set? | B) User: rw-, Group: r--, Others: r-- |

---

## Quiz 4 — `unix-regex-quiz.html`

**Topic:** Regular expressions with grep, character classes, anchors, POSIX ERE  
**Source:** week_02_lec_02, week_03_lec_01, week_03_lec_02  
**Questions (10):**

| # | Type | Prompt | Answer |
|---|------|--------|--------|
| 1 | MCQ | What does `^` mean in a regex? | A) Matches the beginning of a line |
| 2 | MCQ | What is the difference between `^[A-Za-z]+$` and `[A-Za-z]+`? | B) The first requires the entire line to be letters; the second matches anywhere in the line |
| 3 | MCQ | Which grep flag enables extended regular expressions? | B) `-E` |
| 4 | MCQ | Which pattern matches one or more digits? | A) `[0-9]+` |
| 5 | trace | Write a grep command to list all `.c` files via `ls -l` output. | `ls -l \| grep -E '\.c'` |
| 6 | MCQ | What does `$` anchor do in a regex? | B) Matches the end of a line |
| 7 | MCQ | Which regex matches a string that is exactly 3 lowercase letters? | C) `^[a-z]{3}$` |
| 8 | MCQ | In the regex `[^abc]`, what does `^` inside brackets mean? | B) Match any character that is NOT a, b, or c |
| 9 | MCQ | Which grep command uses color highlighting and extended regex? | A) `grep -E --color=auto 'pattern' file` |
| 10 | MCQ | What does `.*` match? | A) Zero or more of any character |

---

## Quiz 5 — `c-fundamentals-quiz.html`

**Topic:** C Ch2 — identifiers, keywords, data types, variables, type conversion, main(), printf/scanf basics  
**Source:** week_04_lec_01, week_04_lec_02  
**Questions (10):**

| # | Type | Prompt | Answer |
|---|------|--------|--------|
| 1 | MCQ | Which of the following is a legal C identifier? | B) `_done` |
| 2 | MCQ | Which of the following is a C keyword (cannot be used as an identifier)? | C) `struct` |
| 3 | MCQ | What return value from `main()` indicates normal program termination? | A) 0 |
| 4 | MCQ | What is the correct way to declare an integer variable `x` with value 5? | B) `int x = 5;` |
| 5 | MCQ | Which data type is best for storing a single character? | A) `char` |
| 6 | MCQ | What is the result of `int x = 7 / 2;` in C? | B) 3 (integer division truncates) |
| 7 | trace | What does C print? `int x = 2; printf("%d", ++x * 5);` | `15` |
| 8 | MCQ | C identifiers are: | B) Case-sensitive (`job` and `Job` are different) |
| 9 | MCQ | Which format specifier is used to print a `float` with 2 decimal places? | B) `%.2f` |
| 10 | MCQ | What does `scanf("%d", &x)` require the second argument to be? | B) The address of `x` (i.e., `&x`) |

---

## Quiz 6 — `exam1-mixed-quiz.html`

**Topic:** Mixed Exam 1 — Unix concepts, permissions, vi, regex, C fundamentals, operators  
**Source:** All week 01–05 material  
**Questions (12):**

| # | Type | Prompt | Answer |
|---|------|--------|--------|
| 1 | MCQ | What layer coordinates between applications and hardware? | B) Operating System |
| 2 | MCQ | Which combination suspends (does NOT terminate) a running process? | B) Ctrl+Z |
| 3 | trace | Write the chmod command (octal) for user=rwx, group=r-x, others=r-x. | `chmod 755 file.txt` |
| 4 | MCQ | What does `wc -l file.txt` count? | A) The number of lines in the file |
| 5 | MCQ | In vi, which command enters command mode from insert mode? | B) `Esc` |
| 6 | MCQ | Which regex matches lines that start with a digit? | A) `^[0-9]` |
| 7 | MCQ | What is the output of `printf("%d", 5 * 3 % 2)` in C? | A) 1 |
| 8 | trace | What does C print? `int i = 7, j = 8; i *= j + 1; printf("%d", i);` | `63` |
| 9 | MCQ | Which is NOT a valid C keyword? | D) `real` |
| 10 | MCQ | What does `i = j = k = 0;` do in C? | B) Assigns 0 to k, then j, then i (right-to-left) |
| 11 | MCQ | Which printf format specifier prints a decimal integer? | A) `%d` |
| 12 | trace | What does `ls -l \| grep -E '\.c'` print? | Lines from `ls -l` output that contain `.c` |

---

## Implementation Notes

- **Agent allocation:** Use 2–3 parallel agents in worktrees, each building 2 quizzes, then octopus-merge into `dev`.
- **Naming convention:** `<topic>-quiz.html` (matches Final Content style, no `ch##_` prefix).
- **Format reference:** Copy CSS/JS scaffold from `resources/exam2/loops-quiz.html` — do not reinvent.
- **Grading:** MCQ answers graded by exact button text match; trace answers graded by exact string equality (trimmed, case-sensitive unless otherwise noted). Trace answers above are the exact strings expected.

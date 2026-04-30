# Final Content Quiz Plan

Quizzes for the "Final Content" section (`resources/new/`), covering weeks 11–15 material.
Each quiz is one HTML file served at `/new/<filename>`.

## Exam Context

The final exam question distribution (from review slide):
- **MCQ** ~40%: output determination, conceptual multiple choice
- **Short answer** 40–50%: output without options, code comprehension
- **Code write/fill-in** 10–20%: fill blanks, write small programs

Each quiz below mirrors this distribution.

---

## Quiz 1 — `strings-quiz`

**Topic:** Chapter 13 (C book) — String functions  
**Source slides:** `week_11_lec_01_ch_13.pdf`

### Key concepts to cover
- `strlen` return type (`size_t`), what it excludes (null char)
- `strcpy` vs `strncpy` — null termination behavior, safety
- `strcat` vs `strncat` — buffer overflow danger
- `strcmp` — return value meaning (<0, 0, >0), lexicographic comparison
- `scanf("%s", str)` — stops at whitespace, no `&` needed
- `scanf(" %99[^\n]", str)` / `gets(str)` for full-line reads
- `printf("%.ps", str)` — print first p chars
- `printf("%ms", str)` — field width, left-justify with `-`
- `puts(str)` — adds newline automatically

### Question breakdown (10 questions)

| # | Type | Question |
|---|------|----------|
| 1 | MCQ | What does `strlen("hello\0world")` return? (A) 5 (B) 11 (C) 10 (D) 6 |
| 2 | MCQ | `strncpy(dest, src, 3)` on `src="Hello"` — is `dest` null-terminated? (A) Yes always (B) No, not if n < strlen(src) (C) Yes if dest was zeroed (D) Depends on OS |
| 3 | MCQ | `strcmp("Texas", "Dallas")` returns: (A) 0 (B) positive (C) negative (D) undefined |
| 4 | MCQ | Which reads a full line including spaces into `str`? (A) `scanf("%s", str)` (B) `scanf(" %99[^\n]", str)` (C) `printf("%s", str)` (D) `strlen(str)` |
| 5 | Short answer (output) | Given `char s[10]="abc"; strcat(s,"def"); printf("%s",s);` — what is output? |
| 6 | Short answer (output) | Given `char s[]="Hello"; printf("%.3s\n", s);` — what prints? |
| 7 | Short answer (output) | `strcpy(d,"Hello"); strncpy(d,s,3)` where s="CSC3320" — trace `d` step by step |
| 8 | Short answer | Why is `strcat(str1,"def")` wrong if `char str1[6]="abc"`? What's the safe alternative? |
| 9 | Code fill-in | Fill blank: `char *p = ______; strcpy(p, src);` to safely copy a string of length n |
| 10 | Code fill-in | Fill in: sort two strings alphabetically using `strcmp` in an `if` statement |

---

## Quiz 2 — `structures-quiz`

**Topic:** Chapter 16 — Structures, Unions, Enumerations  
**Source slides:** `week_12_lec_01_ch_16.pdf`, `week_13_lec_02_ch_13_Unix.pdf` (memory alignment recap)

### Key concepts to cover
- Declaring a struct (anonymous vs tagged `struct part` vs `typedef`)
- Member access: `.` for value, `->` for pointer
- Struct initialization: `{528, "Disk drive", 10}` and designated `{.number=120}`
- Copying structs with `=`
- Passing struct by value vs by pointer (`struct part *p`) — which can modify caller
- Returning a struct from a function
- Arrays of structs: `struct part inventory[100]`
- `typedef struct { ... } Part;` — can then use `Part` without `struct` keyword
- Memory alignment / padding rules (largest member alignment, round up to multiple)
- Unions — all members share same memory, size = largest member
- Enumerations (`enum { SUN, MON, TUE }` — SUN=0 by default)

### Question breakdown (12 questions)

| # | Type | Question |
|---|------|----------|
| 1 | MCQ | Access member `number` of struct pointer `p`: (A) `p.number` (B) `p->number` (C) `*p.number` (D) `&p.number` |
| 2 | MCQ | `typedef struct { int x; } Point;` — which declaration is valid? (A) `struct Point p;` (B) `Point p;` (C) Both (D) Neither |
| 3 | MCQ | `sizeof(struct stu_a { int i; char c; })` — what is it on a 32-bit-aligned system? (A) 5 (B) 8 (C) 4 (D) 6 |
| 4 | MCQ | A union with members `int i` (4 bytes) and `double d` (8 bytes) — what is sizeof? (A) 4 (B) 8 (C) 12 (D) 16 |
| 5 | MCQ | `enum Color { RED, GREEN=5, BLUE }` — what is `BLUE`? (A) 1 (B) 2 (C) 6 (D) 5 |
| 6 | Short answer (output) | Trace output of the struct `update`/`display` example from slides (p1 initialized to 120, updated to 210) |
| 7 | Short answer | What is `sizeof(struct stu_c { int i; long l; char c; })`? Explain the padding. |
| 8 | Short answer | What is `sizeof(struct stu_f { int i; double d; char c; })`? Explain. |
| 9 | Short answer | Can you copy a struct with `part1 = part2`? Can you compare with `part1 == part2`? Explain. |
| 10 | Code fill-in | Complete `void update_part(struct part *p)` to set `number` to 123 using both `->` and `(*p).` syntax |
| 11 | Code fill-in | Complete `struct part build_part(int num, const char *name, int on_hand)` — fill in the body |
| 12 | Code write | Declare a struct `Student` with fields `id` (int), `name` (char[50]), `gpa` (double). Write a function that takes a pointer and prints all fields. |

---

## Quiz 3 — `dynamic-memory-quiz`

**Topic:** Chapter 17 — Dynamic Memory Allocation & Linked Lists  
**Source slides:** `week_12_lec_02_ch_17.pdf`, `week_13_lec_01_ch_17_part_2.pdf`

### Key concepts to cover
- `malloc(size)` — allocates, uninitialized, returns `void *`, returns NULL on failure
- `calloc(n, size)` — allocates n×size bytes, zeroed
- `realloc(ptr, newsize)` — resize; old data preserved up to min(old, new)
- `free(ptr)` — release; always pair with malloc
- Allocating a string: `malloc(n + 1)` (+1 for null char)
- Allocating an array: `malloc(n * sizeof(int))`
- Allocating a struct: `malloc(sizeof(struct rec))`
- NULL check after malloc
- Memory leak / garbage — what it is, why C has no GC, how `free` prevents it
- Linked list node: `struct Node { int data; struct Node *next; }`
- Creating head node, appending nodes
- Traversing: `while (current != NULL) { ... current = current->next; }`
- Freeing a linked list

### Question breakdown (11 questions)

| # | Type | Question |
|---|------|----------|
| 1 | MCQ | `malloc` returns `NULL` when: (A) memory is initialized (B) allocation fails (C) size is 0 (D) pointer is declared |
| 2 | MCQ | Allocate array of 10 ints: (A) `malloc(10)` (B) `malloc(10 * sizeof(int))` (C) `calloc(10)` (D) `malloc(sizeof(int))` |
| 3 | MCQ | Difference between `malloc` and `calloc`: (A) calloc takes one arg (B) calloc initializes to 0 (C) malloc is slower (D) No difference |
| 4 | MCQ | After `p = malloc(...); q = malloc(...); p = q;` — what happens to the first block? (A) Freed automatically (B) Becomes garbage (memory leak) (C) Accessible via q (D) Copied |
| 5 | MCQ | Allocate string for n chars: (A) `malloc(n)` (B) `malloc(n+1)` (C) `malloc(n-1)` (D) `malloc(sizeof(char))` |
| 6 | Short answer (output) | What does the `calloc` example print? (`ptr = calloc(5, sizeof(int))` then print all elements) |
| 7 | Short answer | What is a memory leak? Give an example in C. How is it prevented? |
| 8 | Short answer | Given: `struct Node *head = NULL;` followed by code creating two nodes — draw the linked list state and what `while (current != NULL)` prints. |
| 9 | Short answer | Why must you use `realloc`'s return value (not overwrite the same pointer directly) when checking for failure? |
| 10 | Code fill-in | Fill in the blanks to allocate and initialize a `struct rec *r` dynamically |
| 11 | Code write | Write a function `free_list(struct Node *head)` that frees every node in a singly linked list |

---

## Quiz 4 — `file-management-quiz`

**Topic:** Unix Book Ch 13 — File Management (stdio + system calls)  
**Source slides:** `week_13_lec_02_ch_13_Unix.pdf`, `week_14_lec_01_ch_13_Unix_Part-2.pdf`

### Key concepts to cover
- `fopen(filename, mode)` — returns `FILE *`, NULL on failure
- Modes: `"r"`, `"w"` (truncates), `"a"` (appends), `"r+"`, `"w+"`, `"a+"`, binary variants `"rb"`, `"wb"`, etc.
- `fgets(buf, n, fp)` — reads up to n-1 chars, null-terminates
- `fputs(str, fp)` — write string to file
- `fprintf(fp, fmt, ...)` — like printf but to file
- `fread(&val, size, count, fp)` / `fwrite(&val, size, count, fp)` — binary I/O
- `fclose(fp)` — always close after use
- `lseek(fd, offset, whence)` — SEEK_SET, SEEK_CUR, SEEK_END
- Low-level: `open(path, flags, mode)`, `read(fd, buf, n)`, `write(fd, buf, n)`, `close(fd)`
- Flags: `O_RDONLY`, `O_WRONLY`, `O_RDWR`, `O_CREAT`, `O_TRUNC`
- `unlink(path)` — removes directory entry; data deleted when last fd closed
- Hard links vs symbolic (soft) links — differences (inode vs pathname)

### Question breakdown (11 questions)

| # | Type | Question |
|---|------|----------|
| 1 | MCQ | `fopen("f.txt","w")` on an existing file: (A) Error (B) Appends to end (C) Truncates and overwrites (D) Opens read-only |
| 2 | MCQ | Which mode opens for reading AND writing, starting at beginning, without truncating? (A) `"w+"` (B) `"r+"` (C) `"a+"` (D) `"r"` |
| 3 | MCQ | `fread(&num, sizeof(int), 1, rf)` returns 1 when: (A) file is empty (B) one element successfully read (C) error occurred (D) EOF reached |
| 4 | MCQ | `O_CREAT | O_WRONLY | O_TRUNC` in `open()` is equivalent to `fopen` mode: (A) `"r"` (B) `"a"` (C) `"w"` (D) `"r+"` |
| 5 | MCQ | After `unlink("file.txt")`, a process still has the file open. The data: (A) Is deleted immediately (B) Remains until fd is closed (C) Is moved to /tmp (D) Is undefined |
| 6 | MCQ | Hard link vs soft link: (A) Soft link survives deletion of original (B) Hard link points to same inode (C) Hard link can span filesystems (D) Soft link has same inode as original |
| 7 | Short answer (output) | Given `fopen("test.txt","r")` followed by `fgets(buff, 255, fp)` and `printf("%s\n", buff)` where file contains "Hello\nWorld" — what prints? |
| 8 | Short answer | What are 3 reasons `fopen` might return NULL? |
| 9 | Short answer | Explain what `lseek(fd, 5, SEEK_SET)` does. What does the next `read()` call start from? |
| 10 | Code fill-in | Fill in blanks to write integer `42` to `"data.bin"` in binary mode using `fwrite` |
| 11 | Code write | Write a complete C snippet that opens `"output.txt"` for appending, writes the string `"log entry\n"` using `fputs`, and closes the file |

---

## Quiz 5 — `process-management-quiz`

**Topic:** Unix Book Ch 13 — Process Management  
**Source slides:** `week_14_lec_01_ch_13_Unix_Part-2.pdf`, `week_14_lec_02_ch_13_Unix_Part-3.pdf`, `week_15_lec_02_Unix_and_etc_Part-4.pdf`

### Key concepts to cover
- Process vs program vs processor distinction
- Process abstractions: logical control flow, private address space
- Process states: new → ready → running → waiting → terminated
- `fork()` — calls once, returns twice (0 to child, child PID to parent, -1 on error)
- Child is exact copy of parent; separate memory spaces
- Cannot predict which runs first (scheduler)
- `getpid()` — current process PID
- `wait()` / `waitpid()` — parent waits for child; prevents zombies
- `exec()` family — replace process image; fork+exec pattern
- `exit()` — terminate process
- Zombie process — child exited but parent hasn't called `wait()`; occupies process table entry
- `dup2(oldfd, newfd)` — redirect file descriptor
- Redirecting stdout to file: `dup2(fd, STDOUT_FILENO)` then `close(fd)`
- Redirecting stdin from file: `dup2(fd, STDIN_FILENO)`
- Pipes: `pipe(filedes)` — `filedes[1]` write end, `filedes[0]` read end
- Pipe blocking: reader blocks until data written; returns 0 (EOF) when all write ends closed

### Question breakdown (12 questions)

| # | Type | Question |
|---|------|----------|
| 1 | MCQ | `fork()` returns in the child process: (A) -1 (B) Child's PID (C) 0 (D) Parent's PID |
| 2 | MCQ | After a successful `fork()`, how many times does the line after it execute? (A) 1 (B) 2 (C) 0 (D) Depends |
| 3 | MCQ | A zombie process: (A) Uses lots of CPU (B) Is still running (C) Has exited but not been waited on (D) Is a process whose parent died |
| 4 | MCQ | Which process state transition happens when a process is waiting for I/O to complete? (A) running → ready (B) running → waiting (C) waiting → terminated (D) ready → new |
| 5 | MCQ | `dup2(fd, STDOUT_FILENO)` causes: (A) fd to be closed (B) stdout to write to whatever fd points to (C) stdin to read from fd (D) fd to point to stdout |
| 6 | MCQ | When a reader tries to read from a pipe and all write ends are closed: (A) Blocks forever (B) Returns -1 (C) Returns 0 (EOF) (D) Sends SIGPIPE |
| 7 | Short answer (output) | Trace this fork code: parent prints `"A"`, child prints `"B"`, both print `"C"`. How many lines of output, what are they? (Note: order not guaranteed) |
| 8 | Short answer (output) | Given the `calloc` example where `ptr = calloc(5, sizeof(int))`, then 5 elements printed — what is the output? |
| 9 | Short answer | Why must a parent call `wait()` after `fork()`? What problem does skipping it cause? |
| 10 | Short answer | What is the `fork+exec` pattern used for? Give a real-world example. |
| 11 | Code fill-in | Fill in the blanks: create a child with `fork()`, child prints its PID with `getpid()`, parent waits for child |
| 12 | Code fill-in | Fill in: use `dup2` to redirect stdout to `"output.txt"` then print `"Hello"` so it goes to the file |

---

## Quiz 6 — `final-mixed-quiz`

**Topic:** Mixed review — all final exam chapters  
**Source:** All week 11–15 slides + review slide topics

### Coverage mapping (mirrors exam syllabus)
- Ch 13 strings: 2 questions
- Ch 16 structures + memory alignment: 3 questions  
- Ch 17 dynamic memory + linked lists: 2 questions
- Unix file management: 2 questions
- Unix process management + pipes: 3 questions

### Question breakdown (12 questions)

| # | Type | Topic | Question |
|---|------|-------|---------|
| 1 | MCQ | Strings | What does `strcmp("apple","apple")` return? |
| 2 | Short answer | Strings | Print only first 4 chars of `str` using printf format spec |
| 3 | MCQ | Structures | `sizeof(struct { long l; int i; char c; })` — answer with alignment |
| 4 | MCQ | Structures | Difference between `struct part p` passed by value vs `struct part *p` passed by pointer |
| 5 | Short answer | Structures | Write a `typedef` struct for a 2D `Point` with `x` and `y` doubles |
| 6 | MCQ | Dynamic memory | `realloc(NULL, n)` is equivalent to: (A) free(n) (B) malloc(n) (C) calloc(1,n) (D) error |
| 7 | Short answer (output) | Dynamic memory | Given linked list traversal code — what does `while (current != NULL)` print for 3 nodes with data 10, 20, 30? |
| 8 | MCQ | File management | Which `fopen` mode appends if file exists, creates if not? |
| 9 | Short answer | File management | Write the `open()` system call flags equivalent to `fopen("f","r+")` |
| 10 | MCQ | Process mgmt | How many processes exist after 2 successive `fork()` calls with no branching? (A) 2 (B) 3 (C) 4 (D) 1 |
| 11 | Short answer | Process mgmt | Explain what `dup2(fd, 1)` does, where fd was opened as `"log.txt"` in write mode |
| 12 | Code write | Mixed | Write a program that: (1) forks a child, (2) child writes its PID to `"pid.txt"`, (3) parent waits and prints "Done" |

---

## Implementation Notes

- **Format:** Each quiz is a self-contained HTML file with embedded CSS and JS (no external deps)
- **Interactivity:** MCQs are clickable with instant feedback; short-answer shows expected answer on reveal; code fill-in uses `<textarea>` with a "Show Answer" button
- **File naming convention:** `<topic>-quiz.html` → served as `/new/<topic>-quiz`
- **Ordering:** Displayed in the order they appear in the directory listing

## Implementation Order

1. `strings-quiz.html` — most straightforward string function questions
2. `structures-quiz.html` — struct/union/enum + memory alignment
3. `dynamic-memory-quiz.html` — malloc/calloc/realloc + linked lists
4. `file-management-quiz.html` — stdio + low-level file I/O
5. `process-management-quiz.html` — fork/exec/wait + dup2 + pipes
6. `final-mixed-quiz.html` — cumulative mixed review

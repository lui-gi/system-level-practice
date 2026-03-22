# Exam 2 Practice Quiz Plan — CSC 3320

**Exam date:** March 26, 2026
**Chapters covered:** 3 (I/O), 4 (Expressions), 5 (Selection), 6 (Loops), 8 (Arrays), 9 (Functions), 11 (Pointers), 12 (Pointers & Arrays)

Interactive quiz files live in `resources/`. Each chapter below maps to one HTML quiz file.

---

## Chapter 3: Formatted I/O → `resources/ch03_io_formatted.html`

| # | Type | Question | Answer |
|---|------|----------|--------|
| 1 | MCQ | `scanf("%d %d", &a, &b)` vs `scanf("%d%d", &a, &b)` for integers? | Identical in practice — `%d` skips whitespace automatically |
| 2 | MCQ | Key difference between `scanf("%c %c", &a, &b)` and `scanf("%c%c", &a, &b)`? | Space skips whitespace before 2nd char; without space, reads raw chars including `\n` |
| 3 | MCQ | Format specifier to read a single `char`? | `%c` |
| 4 | MCQ | Why does `scanf("%d", &x)` need `&x` but `scanf("%s", str)` does not? | Array name already decays to a pointer to its first element |
| 5 | MCQ | `scanf("%c%c", &a, &b)` — user types `A` then Enter. What is `b`? | `'\n'` (newline) — no space means no whitespace skip |

---

## Chapter 4: Expressions → `resources/ch04_expressions.html`

| # | Type | Question | Answer |
|---|------|----------|--------|
| 1 | Trace | `int x=5, y=3, z; z=(x<y);` — value of `z`? | `0` (false = 0 in C) |
| 2 | Trace | `a=15; b=10; c=++a-b; d=b+++a;` — values of a, b, c, d? | `a=16 b=11 c=6 d=26` |
| 3 | Trace | `int i=6, j=4, y; y=(j++)*(++i);` — values of i, j, y? | `i=7 j=5 y=28` |
| 4 | Trace | `int x, y=10; char z='2'; x=y+z;` (ASCII `'2'`=50) — value of x? | `60` |
| 5 | Trace | `int n=49; n%3==0 ? printf("Hello!") : printf("World");` — output? | `World` |
| 6 | Trace | `int a=0; a=(a==(a==1)); printf("%d",a);` — output? | `1` |
| 7 | MCQ | `int x=5; int z = 1 \|\| --x;` — value of x? | `5` (short-circuit: RHS never evaluated) |

---

## Chapter 5: Selection Statements → `resources/ch05_selection.html`

| # | Type | Question | Answer |
|---|------|----------|--------|
| 1 | Trace | `switch(a)` with `a=5`, no `break` in any case — output? | `FiveSixSevenNot Found` (fall-through) |
| 2 | MCQ | What is fall-through in a switch? | After a matching case, execution continues into subsequent cases without stopping |
| 3 | MCQ | Which types can be used in a switch expression? | Integer types (int, char, short, long, enum) — NOT float or double |
| 4 | MCQ | In an else-if ladder, how many branches execute when a condition is true? | Exactly one |
| 5 | Trace | `int a=7; if(a>10) "Big"; else if(a>5) "Medium"; else "Small";` — output? | `Medium` |

---

## Chapter 6: Loops → `resources/ch06_loops.html`

| # | Type | Question | Answer |
|---|------|----------|--------|
| 1 | Trace | Nested loop with `continue` (skip even i) and inner loop `sum+=j; break;` for i=1..10 — final `sum`? | `5` |
| 2 | MCQ | What does `continue` do in a `for` loop? | Skips remaining body; jumps to the update expression, then re-checks the condition |
| 3 | MCQ | What does `break` do inside an inner nested loop? | Exits only the innermost loop containing it |
| 4 | Trace | `int x=1; while(x<20){x*=3;} printf("%d",x);` — output? | `27` |
| 5 | MCQ | Which loop guarantees the body executes at least once? | `do-while` |

---

## Chapter 8: Arrays → `resources/ch08_arrays.html`

| # | Type | Question | Answer |
|---|------|----------|--------|
| 1 | Trace | Array `DATA={1..10}`, even-index → `2*val`, odd-index → `2*val-1`. What is `DATA[6]` after the loop? | `14` (index 6 is even: 2×7=14) |
| 2 | MCQ | Valid indices for `int arr[5]`? | `0` through `4` |
| 3 | MCQ | Accessing `arr[n]` when `n` equals the declared size? | Undefined behavior — may crash, corrupt memory, or return garbage |
| 4 | Trace | Function modifies `arr[0] *= 2` on `int a[3]={5,10,15}`. What does `printf("%d", a[0])` print? | `10` (arrays passed by pointer — original modified) |
| 5 | MCQ | Correct way to initialize array of 4 ints? | `int arr[4] = {10, 20, 30, 40};` |

---

## Chapter 9: Functions → `resources/ch09_functions.html`

| # | Type | Question | Answer |
|---|------|----------|--------|
| 1 | Trace | Global `x=10`, `change()` has `static int x=5; x++; printf("%d ",x);`. Called twice, then `printf("%d",x)` in main. Output? | `6 7 10` |
| 2 | Trace | Call-by-address: `void increment(int *n){(*n)++;}`, `a=10; increment(&a);` — prints `a`? | `11` |
| 3 | Trace | Call-by-value: `void increment(int n){n++;}`, `a=10; increment(a);` — prints `a`? | `10` |
| 4 | MCQ | Scope of a `static` local variable? | Only within the function where it is declared |
| 5 | MCQ | Initial value: global vs local variable? | Globals auto-initialized to `0`; locals are uninitialized (garbage) |

---

## Chapters 11 & 12: Pointers / Pointers & Arrays
Already covered by existing quizzes in `resources/`:
- `ch11_pointer_basics.html` — declaring pointers, `&` and `*`, dereferencing
- `ch11_pointer_assignment.html` — pointer assignment
- `ch11_pointers_as_args.html` — passing pointers to functions
- `ch12_pointer_arithmetic.html` — pointer arithmetic
- `ch12_star_increment.html` — `*p++` vs `(*p)++`
- `ch12_2d_arrays_pointers.html` — 2D arrays and pointers
- `ch12_array_as_pointer.html` — array name as constant pointer

---

## Key Topics to Know for the Exam

### Exam format
- MCQ ~40%, Short Answer 40–50%, Write/fill-in code 10–20%
- One A4 page double-sided hand-written cheat sheet allowed

### High-priority concepts
1. **I/O:** `%c` whitespace behavior, `&` with scanf
2. **Expressions:** pre vs post increment/decrement, boolean values (0/1), ASCII arithmetic, ternary operator, short-circuit `&&`/`||`
3. **Selection:** switch fall-through (no `break`), valid switch types, else-if mutual exclusivity
4. **Loops:** `break` exits only innermost loop, `continue` goes to update step, `do-while` runs at least once
5. **Arrays:** 0-based indexing, out-of-bounds = UB, arrays passed by pointer
6. **Functions:** call-by-value vs call-by-address (`*`), static local persists across calls, global auto-init to 0
7. **Pointers:** `*` (dereference), `&` (address-of), pointer arithmetic (`*(ptr+1)`)
8. **Pointers & Arrays:** array name = constant pointer to first element

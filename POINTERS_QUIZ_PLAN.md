# Pointers Quiz — Implementation Plan

## Overview
8 self-contained HTML quiz files go in `resources/` at the project root.
The Express backend (`server/src/routes/resources.ts`) auto-serves any `.html` in that folder via `/api/resources`.
The React frontend (`client/src/pages/PracticePage.tsx`) renders each file's HTML via `dangerouslySetInnerHTML` inside a Tailwind `prose` div.

**Each file is independent — assign one file per terminal.**

---

## Shared HTML/CSS/JS Template

Every file must embed this `<style>` block and follow the JS data-driven pattern below.
Copy-paste the template, then fill in the `questions` array.

### `<style>` block (embed at top of every file)
```html
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  .qz-wrap { font-family: 'Poppins', system-ui, sans-serif; max-width: 720px;
    color: #171717; }
  .qz-header { margin-bottom: 1.5rem; }
  .qz-badge { font-size: .6rem; font-weight: 500; letter-spacing: .1em;
    text-transform: uppercase; padding: .2rem .6rem; border-radius: .375rem;
    display: inline-block; margin-bottom: .4rem;
    background: #f5f5f5; color: #737373; border: 1px solid #e5e5e5; }
  .badge-ch11, .badge-ch12, .badge-ch13 { /* all chapters same neutral style */ }
  .qz-title { font-size: 1.35rem; font-weight: 600; letter-spacing: -.01em;
    margin: .25rem 0 .4rem; }
  .qz-desc  { color: #737373; font-size: .875rem; line-height: 1.5; }
  .q-card { border: 1px solid #e5e5e5; border-radius: .375rem;
    padding: 1.25rem; margin-bottom: 1rem; }
  .q-type { font-size: .6rem; font-weight: 500; letter-spacing: .1em;
    text-transform: uppercase; padding: .15rem .5rem; border-radius: .25rem;
    display: inline-block; margin-bottom: .6rem;
    background: #f5f5f5; color: #737373; border: 1px solid #e5e5e5; }
  .q-prompt { margin: .5rem 0 .75rem; font-size: .9rem; line-height: 1.6; }
  pre { background: #111; color: #e5e5e5; padding: .9rem 1rem;
    border-radius: .375rem; overflow-x: auto; font-size: .8rem;
    border-left: 3px solid hsl(173,53%,19%); margin: .75rem 0; white-space: pre; }
  /* MCQ buttons */
  .mcq-opts { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .5rem; }
  .mcq-btn { padding: .375rem .875rem; border: 1.5px solid #e5e5e5;
    border-radius: .375rem; background: #fff; cursor: pointer; color: #171717;
    font-size: .875rem; font-family: 'Poppins', sans-serif; transition: all .15s; }
  .mcq-btn:hover:not(:disabled) { border-color: hsl(173,53%,19%); background: #f5f5f5; }
  .mcq-btn.selected { border-color: hsl(173,53%,19%); background: hsl(173,30%,94%);
    font-weight: 500; }
  .mcq-btn:disabled { cursor: default; }
  .mcq-btn.correct  { border-color: #16a34a; background: #dcfce7; color: #166534; }
  .mcq-btn.wrong    { border-color: #dc2626; background: #fee2e2; color: #991b1b; }
  /* Textarea */
  .trace-input { width: 100%; margin-top: .5rem; padding: .5rem;
    font-family: 'Poppins', monospace; font-size: .875rem; border: 1.5px solid #e5e5e5;
    border-radius: .375rem; resize: vertical; min-height: 60px; color: #171717; }
  .trace-input:focus { outline: none; border-color: hsl(173,53%,19%); }
  .trace-input:disabled { background: #f9fafb; }
  /* Submit & results */
  .submit-btn { display: block; margin: 1.5rem auto; padding: .5rem 2rem;
    background: hsl(173,53%,19%); color: #fafafa; border: none; border-radius: .375rem;
    font-size: .875rem; font-weight: 500; font-family: 'Poppins', sans-serif;
    cursor: pointer; transition: opacity .15s; }
  .submit-btn:hover { opacity: .88; }
  .submit-btn:disabled { opacity: .45; cursor: default; }
  #results { display: none; border-top: 1px solid #e5e5e5; padding-top: 1.25rem;
    margin-top: 1rem; }
  .score-head { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }
  .r-row { padding: .6rem .75rem; border-radius: .375rem; margin-bottom: .5rem;
    font-size: .875rem; }
  .r-correct { background: #dcfce7; color: #166534; }
  .r-wrong    { background: #fee2e2; color: #991b1b; }
  .r-exp { font-size: .8rem; margin-top: .25rem; opacity: .85; }
</style>
```

### JS pattern (embed at bottom of every file)
```html
<script>
const questions = [
  // { id: 1, type: "mcq"|"trace"|"write", prompt: "...", code: "...",
  //   options: ["A) ...", "B) ...", ...],   // MCQ only
  //   answer: "A) ...",                     // exact option string for MCQ
  //                                         // trimmed string for trace/write
  //   explanation: "..." }
];

// ── render ────────────────────────────────────────────────────────────────────
const container = document.getElementById("quiz-body");
questions.forEach((q, i) => {
  const card = document.createElement("div");
  card.className = "q-card";
  card.innerHTML = `
    <span class="q-type type-${q.type}">${q.type}</span>
    <p class="q-prompt"><strong>Q${i+1}.</strong> ${q.prompt}</p>
    ${q.code ? `<pre>${q.code}</pre>` : ""}
    <div id="input-${q.id}"></div>`;
  container.appendChild(card);

  const inputArea = document.getElementById(`input-${q.id}`);
  if (q.type === "mcq") {
    const wrap = document.createElement("div");
    wrap.className = "mcq-opts";
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "mcq-btn";
      btn.textContent = opt;
      btn.dataset.qid = q.id;
      btn.onclick = () => {
        wrap.querySelectorAll(".mcq-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      };
      wrap.appendChild(btn);
    });
    inputArea.appendChild(wrap);
  } else {
    const ta = document.createElement("textarea");
    ta.className = "trace-input";
    ta.id = `ta-${q.id}`;
    ta.placeholder = q.type === "trace" ? "Type the output or value…" : "Write your answer…";
    inputArea.appendChild(ta);
  }
});

// ── grade ─────────────────────────────────────────────────────────────────────
function grade() {
  let correct = 0;
  const rows = [];
  questions.forEach((q, i) => {
    let userAns = "";
    if (q.type === "mcq") {
      const sel = document.querySelector(`#input-${q.id} .mcq-btn.selected`);
      userAns = sel ? sel.textContent.trim() : "";
      // mark buttons
      document.querySelectorAll(`#input-${q.id} .mcq-btn`).forEach(btn => {
        btn.disabled = true;
        if (btn.textContent.trim() === q.answer) btn.classList.add("correct");
        else if (btn.classList.contains("selected")) btn.classList.add("wrong");
      });
    } else {
      const ta = document.getElementById(`ta-${q.id}`);
      userAns = ta ? ta.value.trim() : "";
      ta.disabled = true;
    }
    const ok = userAns === q.answer;
    if (ok) correct++;
    rows.push({ q, i, ok, userAns });
  });

  // show results
  const res = document.getElementById("results");
  res.style.display = "block";
  const pct = Math.round(correct / questions.length * 100);
  res.innerHTML = `
    <div class="score-head">Score: ${correct} / ${questions.length} (${pct}%)</div>
    ${rows.map(({q, i, ok, userAns}) => `
      <div class="r-row ${ok ? "r-correct" : "r-wrong"}">
        ${ok ? "✓" : "✗"} <strong>Q${i+1}</strong>
        ${ok ? "— Correct" : `— Your answer: <code>${userAns || "(none)"}</code> &nbsp;|&nbsp; Expected: <code>${q.answer}</code>`}
        ${!ok ? `<div class="r-exp">${q.explanation}</div>` : ""}
      </div>`).join("")}`;
  document.getElementById("submit-btn").disabled = true;
}
</script>
```

### Outer HTML wrapper (every file)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TITLE</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
<div class="qz-wrap">
  <div class="qz-header">
    <span class="qz-badge badge-chXX">Chapter XX</span>
    <div class="qz-title">TITLE</div>
    <div class="qz-desc">DESCRIPTION</div>
  </div>
  <div id="quiz-body"></div>
  <button class="submit-btn" id="submit-btn" onclick="grade()">Submit Quiz</button>
  <div id="results"></div>
</div>
<!-- <style> block here -->
<!-- <script> block here -->
</body>
</html>
```

---

## File Assignments

### File 1 — `resources/ch11_pointer_basics.html`
**Badge:** Ch. 11 | **Title:** Pointer Basics
**Description:** Memory model, declaring pointers, `&` and `*` operators

Questions:
1. `MCQ` — What is the value of `j`? Given `int i=5, *p=&i, j=*p;` → `5`
2. `MCQ` — Which declaration makes `p` point only to integers? Options: `int p`, `int &p`, `int *p`, `int p[]` → `int *p`
3. `MCQ` — Given `int i=2, *p=&i;`, what does `*p` evaluate to? → `2`
4. `TRACE` — Given `int a=10, *p=&a; *p=20;`, what is `a`? → `20`
5. `MCQ` — Which prints the address of `x`? Options: `printf("%d", x)`, `printf("%p", &x)`, `printf("%p", *x)`, `printf("%d", &x)` → `printf("%p", &x)`
6. `MCQ` — What happens if you dereference an uninitialized pointer? Options: `Prints 0`, `Prints garbage`, `Undefined behavior / crash`, `Compile error` → `Undefined behavior / crash`

---

### File 2 — `resources/ch11_pointer_assignment.html`
**Badge:** Ch. 11 | **Title:** Pointer Assignment
**Description:** `p = q` vs `*p = *q`, tracing pointer diagrams

Questions:
1. `MCQ` — After `int i=1,j=2,*p=&i,*q=&j; p=q;`, what does `*p` equal? → `2`
2. `MCQ` — After `int i=1,j=2,*p=&i,*q=&j; *p=*q;`, what does `i` equal? → `2`
3. `MCQ` — After `p=q`, does changing `*q` also change `*p`? → `Yes`
4. `TRACE` — Trace: `int i=1,j=2,*p=&i,*q=&j; *q=*p;`. What is `j`? → `1`
5. `MCQ` — `p=q` copies the ___; `*p=*q` copies the ___. Options: `address, value`, `value, address`, `both addresses`, `both values` → `address, value`
6. `TRACE` — After `int i=3,*p=&i,*q=p; *p=7;`, what does `*q` equal? → `7`

---

### File 3 — `resources/ch11_pointers_as_args.html`
**Badge:** Ch. 11 | **Title:** Pointers as Arguments & Return Values
**Description:** Pass-by-pointer, swap, `const` qualifier, return pointer safety

Questions:
1. `MCQ` — After calling `swap(&x, &y)` (correct swap implementation), `x=1,y=2` becomes? → `x=2, y=1`
2. `MCQ` — `void f(const int *p)` — which is legal inside `f`? Options: `*p = 0`, `p = &j`, `p++`, `(*p)++` → `p = &j`
3. `MCQ` — `void f(int * const p)` — which is legal inside `f`? Options: `p = &j`, `*p = 5`, `p++`, `p = NULL` → `*p = 5`
4. `MCQ` — Why is returning `&a` from a function (where `a` is a local `int`) dangerous? Options: `a is const`, `a ceases to exist after return`, `pointers can't be returned`, `only works for global vars` → `a ceases to exist after return`
5. `TRACE` — `void f(int *p){*p=10;} int main(){int x=1; f(&x); printf("%d",x);}` Output? → `10`
6. `MCQ` — To swap two `int` variables using a function, the parameters must be of type? Options: `int`, `int*`, `int&`, `const int*` → `int*`

---

### File 4 — `resources/ch12_pointer_arithmetic.html`
**Badge:** Ch. 12 | **Title:** Pointer Arithmetic
**Description:** Adding/subtracting integers, pointer subtraction, comparison

Questions:
1. `MCQ` — `int a[8]; int *p=&a[2]; int *q=p+3;` — `q` points to? → `a[5]`
2. `MCQ` — `int a[8]; int *p=&a[6]; int *q=p-3;` — `q` points to? → `a[3]`
3. `TRACE` — `int a[]={5,15,34,54,14,2,52,72}; int *p=&a[1],*q=&a[5]; printf("%d",*(p+3));` → `14`
4. `TRACE` — Using the same array above, `printf("%d", q-p);` → `4`
5. `MCQ` — `int a[5]; int *p=&a[0]; p+=4;` — `p` now points to? → `a[4]`
6. `MCQ` — Is `p < q` true if `p=&a[1]` and `q=&a[5]`? → `Yes`

---

### File 5 — `resources/ch12_star_increment.html`
**Badge:** Ch. 12 | **Title:** Combining `*` and `++`
**Description:** Precedence of `*p++`, `(*p)++`, `*++p`, `++*p`

Questions:
1. `MCQ` — `int a[]={1,2,3,4}; int *p=&a[0]; int x=*p++;` — value of `x`? → `1`
2. `MCQ` — After `int a[]={1,2,3,4}; int *p=&a[0]; int x=*p++;` — `p` points to? → `a[1]`
3. `MCQ` — `int a[]={1,2,3,4}; int *p=&a[0]; int x=(*p)++;` — value of `a[0]` after? → `2`
4. `MCQ` — `int a[]={1,2,3,4}; int *p=&a[0]; int x=(*p)++;` — `p` points to? → `a[0]`
5. `MCQ` — `int a[]={1,2,3,4}; int *p=&a[0]; int x=*++p;` — value of `x`? → `2`
6. `MCQ` — `int a[]={1,2,3,4}; int *p=&a[0]; int x=++*p;` — value of `a[0]`? → `2`

---

### File 6 — `resources/ch12_array_as_pointer.html`
**Badge:** Ch. 12 | **Title:** Array Name as Pointer
**Description:** Decay, `p[i]` ≡ `*(p+i)`, equivalence in function params

Questions:
1. `MCQ` — `int a[5]; *a = 7;` modifies which element? → `a[0]`
2. `MCQ` — `int a[5]; *(a+2) = 13;` modifies which element? → `a[2]`
3. `MCQ` — Is `a++` legal when `a` is declared as `int a[10]`? → `No`
4. `MCQ` — `int *p = a;` then `p[3]` is equivalent to? Options: `a[3]`, `a[4]`, `*(a+4)`, `&a[3]` → `a[3]`
5. `MCQ` — `int find(int a[], int n)` and `int find(int *a, int n)` are? → `Equivalent`
6. `TRACE` — `int a[]={10,20,30}; int *p=a; printf("%d",*(p+1));` → `20`

---

### File 7 — `resources/ch12_2d_arrays_pointers.html`
**Badge:** Ch. 12 | **Title:** Pointers and 2D Arrays
**Description:** Row pointers, `(*p)[N]`, processing rows and columns

Questions:
1. `MCQ` — `int a[3][4]; int *p=&a[0][0];` — `*(p+1)` is? → `a[0][1]`
2. `MCQ` — `int a[3][4];` — the type of `a` (the name) is? Options: `int *`, `int (*)[4]`, `int **`, `int (*)[3]` → `int (*)[4]`
3. `MCQ` — `int a[3][4]; int *p=&a[0][0]; p+=4;` — `p` now points to? → `a[1][0]`
4. `MCQ` — To declare a pointer `p` that steps through rows of `int a[5][10]`, use? Options: `int *p`, `int **p`, `int (*p)[10]`, `int (*p)[5]` → `int (*p)[10]`
5. `TRACE` — `int a[2][3]={{1,2,3},{4,5,6}}; int *p=&a[0][0]; printf("%d",*(p+4));` → `5`
6. `MCQ` — `(*p)[i] = 0` in a row-pointer loop clears which element? → `Column i of the current row`

---

### File 8 — `resources/ch13_char_pointers_strings.html`
**Badge:** Ch. 13 | **Title:** Char Pointers and Strings
**Description:** `char[]` vs `char *`, string literals, `strlen`/`strcpy`/`strcat`/`strcmp`

Questions:
1. `MCQ` — `char *s = "hello"; s[0] = 'H';` — result? Options: `Works fine`, `Compile error`, `Undefined behavior (modifying literal)`, `Prints Hello` → `Undefined behavior (modifying literal)`
2. `MCQ` — `char s[] = "hello"; s[0] = 'H';` — result? → `Works fine`
3. `TRACE` — `printf("%d", strlen("hello"));` → `5`
4. `MCQ` — `strcpy(dest, src)` requires `dest` to be? Options: `A string literal`, `Large enough to hold src`, `NULL-terminated already`, `A const pointer` → `Large enough to hold src`
5. `MCQ` — After `char s[20]="abc"; strcat(s,"def");`, `s` contains? → `abcdef`
6. `MCQ` — `strcmp("abc","abc")` returns? → `0`

---

## Verification
1. Place each completed `.html` file in `resources/`
2. Run `npm run dev` from project root
3. Navigate to `/practice` — all 8 files should appear as links
4. Click each — quiz renders, buttons respond, Submit grades and shows score

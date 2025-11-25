document.addEventListener("DOMContentLoaded", function () {
  const testForm = document.querySelector(".test-form");
  const scriptURL = "https://script.google.com/macros/s/AKfycbwAulwP1rptFDHXCXEZzrr1aw8E_dUkWTZ5Xzpj5OMzUw6yWU-Ac-SPBz7NHLPbIqxj/exec";

  // ✅ To‘g‘ri javoblar (50 ta uchun namunaviy)
    const correctAnswers = {
    q1: 1, q2: 2, q3: 2, q4: 2, q5: 1,
    q6: 2, q7: 1, q8: 2, q9: 2, q10: 2,
    q11: 2, q12: 2, q13: 1, q14: 2, q15: 2,
    q16: 2, q17: 2, q18: 3, q19: 2, q20: 2,
    q21: 1, q22: 2, q23: 3, q24: 2, q25: 1,
    q26: 2, q27: 1, q28: 1, q29: 1, q30: 1,
    q31: 2, q32: 1, q33: 2, q34: 1, q35: 1,
    q36: 1, q37: 1, q38: 1, q39: 1, q40: 2,
    q41: 2, q42: 2, q43: 2, q44: 2, q45: 2,
    q46: 2, q47: 2, q48: 1, q49: 2, q50: 2
  };

  testForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const age = document.getElementById("age").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const source = document.getElementById("source").value.trim();

    if (!name || !surname || !age || !phone) {
      alert("Iltimos, barcha kerakli ma'lumotlarni to‘ldiring!");
      return;
    }

    let correct = 0;
    let wrong = 0;
    let wrongQuestions = [];

    for (let i = 1; i <= 50; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      const answerIndex = selected
        ? Array.from(selected.parentNode.parentNode.children).indexOf(selected.parentNode) + 1
        : null;

      if (answerIndex === correctAnswers[`q${i}`]) {
        correct++;
      } else {
        wrong++;
        wrongQuestions.push(i);
      }
    }

    // 🔹 Level aniqlash
    let level = "";
    if (correct <= 10) level = "Beginner (A1)";
    else if (correct <= 20) level = "Pre-Intermediate (A2–B1)";
    else if (correct <= 35) level = "Upper-Intermediate (B2)";
    else if (correct <= 45) level = "Advanced (C1)";
    else level = "Expert (C2)";

    // 🔹 Natija oynasi
    const overlay = document.createElement("div");
    overlay.classList.add("result-overlay");

    const resultBox = document.createElement("div");
    resultBox.classList.add("result-box");

    resultBox.innerHTML = `
      <h2>📋 Test Results</h2>
      <p><strong>Name:</strong> ${name} ${surname}</p>
      <p><strong>Age:</strong> ${age}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${source ? `<p><strong>Found us via:</strong> ${source}</p>` : ""}
      <hr>
      <p><strong>Level:</strong> ${level}</p>
      <p><strong>Total Questions:</strong> 50</p>
      <p><strong>✅ Correct:</strong> ${correct}</p>
      <p><strong>❌ Wrong (including unanswered):</strong> ${wrong}</p>
      ${
        wrongQuestions.length > 0
          ? `<p><strong>Wrong questions:</strong> ${wrongQuestions.join(", ")}</p>`
          : `<p>Excellent! All answers are correct 🎉</p>`
      }
      <button class="save-btn">Save Result <br>(Saqlash tugmasin bosing va kuting)</button>
    `;

    overlay.appendChild(resultBox);
    document.body.appendChild(overlay);

    // 🔹 Save tugmasi
    resultBox.querySelector(".save-btn").addEventListener("click", () => {
      const formData = new FormData();
      formData.append("timestamp", new Date().toLocaleString());
      formData.append("first_name", name);
      formData.append("last_name", surname);
      formData.append("age", age);
      formData.append("phone", phone);
      formData.append("source", source);
      formData.append("level", level);
      formData.append("total_questions", 50);
      formData.append("correct_answers", correct);
      formData.append("wrong_answers", wrong);
      formData.append("wrong_question_numbers", wrongQuestions.join(", "));

      fetch(scriptURL, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (res.ok) {
            alert("✅ Natijalar muvaffaqiyatli saqlandi!");
            overlay.remove();
          } else {
            alert("❌ Saqlashda xato: " + res.status);
          }
        })
        .catch((err) => alert("❌ Xatolik: " + err));
    });
  });
});

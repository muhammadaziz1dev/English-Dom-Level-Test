document.addEventListener("DOMContentLoaded", function () {
  const testForm = document.querySelector(".test-form");
  const scriptURL = "https://script.google.com/macros/s/AKfycbwAulwP1rptFDHXCXEZzrr1aw8E_dUkWTZ5Xzpj5OMzUw6yWU-Ac-SPBz7NHLPbIqxj/exec";

  // ✅ To‘g‘ri javoblar
const correctAnswers = {
  q1: 1,  // rains
  q2: 2,  // for
  q3: 2,  // was built
  q4: 2,  // would
  q5: 2,  // who
  q6: 2,  // can’t
  q7: 1,  // play
  q8: 2,  // living
  q9: 2,  // seeing
  q10: 2, // carefully
  q11: 3, // much
  q12: 2, // don’t have to
  q13: 2, // had
  q14: 2, // repaired
  q15: 2, // was
  q16: 2, // boring
  q17: 2, // but
  q18: 1, // heavily
  q19: 1, // must have
  q20: 2, // yet
  q21: 2, // a graphic designer
  q22: 2, // once a month
  q23: 2, // in Paris
  q24: 2, // gave a presentation
  q25: 3  // impressed
};




  testForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // 🔹 Forma ma’lumotlari
    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const age = document.getElementById("age").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const source = document.getElementById("source").value.trim();

    if (!name || !surname || !age || !phone) {
      alert("Iltimos, barcha kerakli ma'lumotlarni to‘ldiring!");
      return;
    }

    // 🔹 Test natijasi
    let correct = 0;
    let wrong = 0;
    let wrongQuestions = [];

    for (let i = 1; i <= 25; i++) {
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

    // 🔹 Natija oynasi (modal)
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
      <p><strong>Level:</strong>Intermediate</p>
      <p><strong>Total Questions:</strong> 25</p>
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

    // 🔹 Save button bosilganda Google Sheet ga yuborish
    resultBox.querySelector(".save-btn").addEventListener("click", () => {
      const formData = new FormData();
      formData.append("timestamp", new Date().toLocaleString());
      formData.append("first_name", name);
      formData.append("last_name", surname);
      formData.append("age", age);
      formData.append("phone", phone);
      formData.append("source", source);
      formData.append("level", "Intermediate");
      formData.append("total_questions", 25);
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

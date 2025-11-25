document.addEventListener("DOMContentLoaded", function () {
  const testForm = document.querySelector(".test-form");
  const scriptURL = "https://script.google.com/macros/s/AKfycbwAulwP1rptFDHXCXEZzrr1aw8E_dUkWTZ5Xzpj5OMzUw6yWU-Ac-SPBz7NHLPbIqxj/exec";

  // ✅ To‘g‘ri javoblar
const correctAnswers = {
  q1: 1,  // is going to
  q2: 2,  // more comfortable
  q3: 2,  // has lived
  q4: 2,  // were having
  q5: 2,  // many
  q6: 2,  // must
  q7: 1,  // to
  q8: 2,  // watching
  q9: 2,  // rarely
  q10: 2, // them
  q11: 1, // can’t
  q12: 1, // going
  q13: 1, // enough
  q14: 3, // best
  q15: 2, // was cooking
  q16: 3, // been
  q17: 2, // few
  q18: 1, // speaks
  q19: 2, // make
  q20: 2, // flying
  q21: 2, // in a travel agency
  q22: 2, // arranges trips
  q23: 1, // to visit a hotel
  q24: 3, // traveling
  q25: 1  // last summer
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
      <p><strong>Level:</strong>Pre-Intermediate</p>
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
      formData.append("level", "Pre-Intermediate");
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

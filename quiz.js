fetch("quizData.json")
    .then((response) => response.json())
    .then((quizData) => {
        const subjectName = quizData.subject;
        document.getElementById("subject-name").textContent = subjectName;

        let currentQuestionIndex = 0;
        const totalQuestions = quizData.questions.length;

        const quizContainer = document.getElementById("quiz-container");

        // Start the quiz
        document
            .getElementById("start-quiz")
            .addEventListener("click", function () {
                displayQuestion(quizData, currentQuestionIndex);
                this.style.display = "none"; // Hide the start button
            });

        // Display a single question
        function displayQuestion(quizData, index) {
            const questionData = quizData.questions[index];

            // Clear previous content
            quizContainer.innerHTML = "";

            // Display current question
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");
            questionDiv.innerHTML = `<p>${questionData.question}</p>`;

            const optionsList = document.createElement("ul");
            optionsList.classList.add("options");

            questionData.options.forEach((option, i) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<input type="radio" name="question${index}" value="${option}" id="option${index}-${i}"> <label for="option${index}-${i}">${option}</label>`;
                optionsList.appendChild(listItem);
            });

            questionDiv.appendChild(optionsList);
            quizContainer.appendChild(questionDiv);

            // Next button
            const nextButton = document.createElement("button");
            nextButton.classList.add("button");
            nextButton.textContent = "Next";
            quizContainer.appendChild(nextButton);

            nextButton.disabled = true; // Disable Next button until an answer is selected

            nextButton.addEventListener("click", function () {
                const selectedOption = document.querySelector(
                    `input[name="question${index}"]:checked`
                );

                if (selectedOption) {
                    // Check if the answer is correct and provide feedback
                    const feedbackDiv = document.createElement("div");
                    feedbackDiv.classList.add("feedback");

                    if (selectedOption.value === questionData.answer) {
                        feedbackDiv.innerHTML =
                            "<p class='correct'>Correct!</p>";
                    } else {
                        feedbackDiv.innerHTML = `<p class='incorrect'>Incorrect! The correct answer is: <strong>${questionData.answer}</strong></p>`;
                    }
                    quizContainer.appendChild(feedbackDiv);

                    // Enable the next button after showing feedback
                    nextButton.disabled = false;

                    // Disable the radio buttons after submitting an answer
                    const radioButtons = document.querySelectorAll(
                        `input[name="question${index}"]`
                    );
                    radioButtons.forEach((button) => {
                        button.disabled = true;
                    });

                    // Move to the next question after clicking next
                    nextButton.addEventListener("click", function () {
                        if (currentQuestionIndex < totalQuestions - 1) {
                            currentQuestionIndex++;
                            displayQuestion(quizData, currentQuestionIndex); // Display next question
                        } else {
                            calculateScore(quizData); // End of quiz, calculate score
                        }
                    });
                }
            });

            // Enable the next button once an option is selected
            const radioButtons = document.querySelectorAll(
                `input[name="question${index}"]`
            );

            radioButtons.forEach((button) => {
                button.addEventListener("change", function () {
                    nextButton.disabled = false;
                });
            });
        }

        // Function to calculate the score at the end of the quiz
        function calculateScore(quizData) {
            let score = 0;
            quizData.questions.forEach((question, index) => {
                const selectedOption = document.querySelector(
                    `input[name="question${index}"]:checked`
                );
                if (
                    selectedOption &&
                    selectedOption.value === question.answer
                ) {
                    score++;
                }
            });
            alert(
                `Your score is: ${score} out of ${quizData.questions.length}`
            );
        }
    })
    .catch((error) => {
        console.error("Error loading quiz data:", error);
    });

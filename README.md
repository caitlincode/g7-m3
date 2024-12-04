<a id="readme-top"></a>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#developersandtheircontribution">Developers and their contribution</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is designed to simulate a job interview environment, where a user can practice answering interview questions tailored to a specific job role. Here’s a breakdown of the project:

**User Interaction**:

- Job Title Input: The user types in a job title they are interviewing for
- Interview Flow: The AI Interviewer, powered by Google Gemini, will ask a series of questions, starting with “Tell me about yourself.” The subsequent questions will be dynamically generated based on the user’s responses, focused on the specific job title entered.
- User Response Input: After each question, the user provides a response in a textbox.
- Submission: Once the user answers, they can submit their response, which is then sent to Gemini for evaluation.

**AI Functionality**:

- The AI Interviewer will ask at least 6 questions, based on the job title and user responses.
- At the end of the interview, Gemini will provide feedback on how well the user answered the questions and suggest areas for improvement.

**Generative AI Use**:

- The project utilizes Google Gemini, which powers the AI Interviewer to ask tailored questions and assess the user’s responses based on the job title provided.

**Purpose**: This tool aims to help users prepare for job interviews by simulating real-world interview scenarios, offering personalized feedback, and improving their interview skills.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section lists major frameworks/libraries used to bootstrap this project.

- [![React][React.js]][React-url]
- [![Node][Node.js]][Node-url]
- [![Express][Express.js]][Express-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy of the application up and running follow these simple example steps.

### Prerequisites

**_ Frontend _**

- npm

  ```sh
  npm install npm@latest -g
  ```

- Gemini

  ```sh
  npm install @google/generative-ai
  ```

**_ Backend _**

- express

  ```sh
  npm install express
  ```

- cors

  ```sh
  npm install cors
  ```

### Installation

1. Get a free API Key at [https://ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)
2. Clone the repo
   ```sh
   git clone https://github.com/caitlincode/g7-m3.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API key in `index.js` in the backend directory
   ```js
   const genAI = "ENTER YOUR API KEY";
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

To use the project simply enter a role in the text area then click start interview

Gemini will generate a question to which the user will provide an answer to by typing their response in the text area.

When the interview comes to a conclusion, the user must click End Interview to receive feedback.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Helpful resources

- [Google Gemini](https://ai.google.dev/gemini-api/docs)
- [GitHub](https://github.com)
- [ChatGPT](https://chatgpt.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/node.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Express-url]: https://expressjs.com/

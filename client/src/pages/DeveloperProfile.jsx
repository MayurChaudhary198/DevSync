import { useEffect, useState } from "react";

const DeveloperProfile = () => {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    fetch("https://api.github.com/users/MayurChaudhary198")
      .then((res) => res.json())
      .then((data) => {
        setAvatar(data.avatar_url);
      })
      .catch(() => {
        setAvatar(""); 
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
          {avatar && (
            <img
              src={avatar}
              alt="GitHub Avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-blue-700 mb-2">👨‍💻 Developer Profile</h1>
            <p className="text-gray-700">
              Hey there! I'm <strong>Mayur Chaudhary</strong>, the creator of <strong>DevSync</strong> — a project collaboration tool designed to simplify teamwork and productivity.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-semibold text-blue-600 mb-2">💼 Skills</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>React.js, Node.js, Express.js</li>
              <li>MongoDB, MySQL</li>
              <li>REST APIs, Authentication</li>
              <li>Tailwind CSS, Material UI</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-600 mb-2">📫 Contact</h3>
            <ul className="text-gray-700 space-y-1">
              <li>Email: chaudharymayur198@gmail.com</li>
              <li>LinkedIn: <a href="https://linkedin.com/in/mayur-chaudhary" className="text-blue-500 underline">Mayur Chaudhary</a></li>
              <li>GitHub: <a href="https://github.com/MayurChaudhary198" className="text-blue-500 underline">MayurChaudhary198</a></li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-gray-600 italic">
          "This app is not just a project, it's a vision — to make team collaboration cleaner and smarter."
        </p>
      </div>
    </div>
  );
};

export default DeveloperProfile;
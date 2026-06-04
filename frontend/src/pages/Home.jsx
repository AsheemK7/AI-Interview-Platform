import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Home() {
const [form, setForm] = useState({
position: "Software Intern",
experience: "Fresher",
difficulty: "Easy",
});

const [loading, setLoading] = useState(false);
const navigate = useNavigate();

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

const handleStart = async () => {
  setLoading(true);

  try {
    const res = await api.post("/interview/start", form);

    navigate("/interview/" + res.data._id, {
      state: form,
    });

  } catch (err) {
    alert("Failed to start interview");
  } finally {
    setLoading(false);
  }
};

return ( <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

```
  <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full"></div>

  <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

  <div className="glass w-full max-w-xl rounded-[32px] p-8 md:p-10 shadow-2xl">

    <div className="flex justify-center mb-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl shadow-xl">
        🎙️
      </div>
    </div>

    <h1 className="text-4xl font-extrabold text-center text-white mb-2">
      AI Interview Platform
    </h1>

    <p className="text-center text-slate-400 mb-8 text-lg">
      Configure your interview and begin your AI-powered mock session
    </p>

    <div className="space-y-200">

      <div>
        <label className="block mb-3 text-slate-300 font-semibold text-lg">
          Position
        </label>

        <select
          name="position"
          value={form.position}
          onChange={handleChange}
          className="w-full bg-slate-900/70 border border-slate-700 text-white px-4 py-4 rounded-2xl outline-none focus:border-blue-500 transition"
        >
          <option value="Software Intern">
            Software Intern
          </option>

          <option value="Frontend Developer">
            Frontend Developer
          </option>

          <option value="Backend Developer">
            Backend Developer
          </option>

          <option value="Full Stack Developer">
            Full Stack Developer
          </option>

          <option value="Data Analyst">
            Data Analyst
          </option>
        </select>
      </div>

      <div>
        <label className="block mb-3 text-slate-300 font-semibold text-lg">
          Experience Level
        </label>

        <select
          name="experience"
          value={form.experience}
          onChange={handleChange}
          className="w-full bg-slate-900/70 border border-slate-700 text-white px-4 py-4 rounded-2xl outline-none focus:border-purple-500 transition"
        >
          <option value="Fresher">
            Fresher
          </option>

          <option value="1-2 years">
            1-2 years
          </option>

          <option value="3-5 years">
            3-5 years
          </option>

          <option value="5+ years">
            5+ years
          </option>
        </select>
      </div>

      <div>
        <label className="block mb-3 text-slate-300 font-semibold text-lg">
          Difficulty
        </label>

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full bg-slate-900/70 border border-slate-700 text-white px-4 py-4 rounded-2xl outline-none focus:border-cyan-500 transition"
        >
          <option value="Easy">
            Easy
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Hard">
            Hard
          </option>
        </select>
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] transition-all duration-300 text-white py-4 rounded-2xl font-bold text-lg shadow-xl"
      >
        {loading ? "Starting Interview..." : "Start Interview"}
      </button>

    </div>
  </div>
</div>


);
}

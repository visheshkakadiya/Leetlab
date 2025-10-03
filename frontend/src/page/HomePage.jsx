import { Code, Trophy, Users, BookOpen, Play, Star, ArrowRight, Brain, Bot, MessageSquare, BarChart3, ListChecks, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0f0f] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse" style={{ animationDuration: '5s' }}></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Master DSA & Ace Interviews
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered coding companion for mastering data structures, algorithms, and landing your dream tech job. Practice, learn, and grow with intelligent feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center shadow-lg shadow-blue-500/30"
                onClick={() => navigate("/problems")}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Practicing
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-blue-500 px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center transition-all"
                onClick={() => navigate("/problems")}
              >
                Explore Problems
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0e1414]">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose NexCode?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to master coding and prepare for technical interviews
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Code className="h-10 w-10 text-blue-400" />,
                title: "DSA Problems",
                desc: "Comprehensive collection of data structures and algorithm problems from easy to advanced levels",
                color: "blue"
              },
              {
                icon: <ListChecks className="h-10 w-10 text-green-400" />,
                title: "Create Playlists",
                desc: "Organize problems into custom playlists to track your learning journey and focus areas",
                color: "green"
              },
              {
                icon: <Bot className="h-10 w-10 text-purple-400" />,
                title: "AI Chat Assistant",
                desc: "Get instant help from our AI bot while solving problems. Ask questions, get hints, and learn better",
                color: "purple"
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-orange-400" />,
                title: "AI Code Analysis",
                desc: "Analyze your code complexity automatically. Get insights on time and space complexity with AI",
                color: "orange"
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-pink-400" />,
                title: "Discussion Forum",
                desc: "Share solutions, discuss approaches, and learn from the community with our discussion posts",
                color: "pink"
              },
              {
                icon: <Users className="h-10 w-10 text-cyan-400" />,
                title: "Track Progress",
                desc: "Monitor your solved problems, view statistics, and track your improvement in your profile",
                color: "cyan"
              },
              {
                icon: <Target className="h-10 w-10 text-yellow-400" />,
                title: "Interview Prep",
                desc: "Curated problem sets for top companies like Google, Amazon, Meta, and Microsoft",
                color: "yellow"
              },
              {
                icon: <Trophy className="h-10 w-10 text-red-400" />,
                title: "Variety of Topics",
                desc: "Arrays, Trees, Graphs, Dynamic Programming, System Design, and more coding challenges",
                color: "red"
              },
              {
                icon: <BookOpen className="h-10 w-10 text-indigo-400" />,
                title: "Detailed Solutions",
                desc: "Step-by-step explanations with multiple approaches and optimal solutions for every problem",
                color: "indigo"
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-[#1a1f1f] border border-gray-800 rounded-xl p-6 hover:border-${card.color}-500/50 hover:shadow-lg hover:shadow-${card.color}-500/10 transition-all duration-300`}
              >
                <div className={`w-16 h-16 bg-${card.color}-500/10 rounded-lg flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0a0f0f] via-[#0e1414] to-[#0a0f0f] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl top-0 left-1/4"></div>
          <div className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl bottom-0 right-1/4"></div>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="container mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join developers preparing for top tech companies. Practice with AI assistance, track your progress, and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/30"
              onClick={() => navigate("/signup")}
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-blue-500 px-10 py-4 rounded-xl text-lg font-semibold transition-all"
              onClick={() => navigate("/problems")}
            >
              Browse Problems
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f0f] border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-7 w-7 text-emerald-400" />
                <span className="text-[20px] font-bold text-white">NexCode</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered platform to master DSA, prepare for interviews, and land your dream tech job.
              </p>
            </div>
            {[
              {
                title: "Platform",
                items: [
                  { name: "Problems", path: "/problems" },
                  { name: "Discussions", path: "/discuss" },
                  { name: "Playlists", path: "/playlists" },
                  { name: "Profile", path: "/profile" }
                ],
              },
              {
                title: "Resources",
                items: [
                  { name: "AI Chat Bot", path: "#" },
                  { name: "Code Analysis", path: "#" },
                  { name: "Interview Prep", path: "#" },
                  { name: "Solutions", path: "#" }
                ],
              },
              {
                title: "Company",
                items: [
                  { name: "About Us", path: "#" },
                  { name: "Privacy Policy", path: "#" },
                  { name: "Terms of Service", path: "#" },
                  { name: "Contact", path: "#" }
                ],
              },
            ].map((group, idx) => (
              <div key={idx}>
                <h3 className="font-semibold mb-4 text-white">{group.title}</h3>
                <ul className="space-y-2">
                  {group.items.map((item, i) => (
                    <li key={i}>
                      <Link
                        to={item.path}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} NexCode. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="https://x.com/vishesh5908701" target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link to="https://github.com/visheshkakadiya/" target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link to="https://www.linkedin.com/in/vishesh-kakadiya-b0865b303/" target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
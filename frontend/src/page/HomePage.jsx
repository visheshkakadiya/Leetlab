import { Code, Trophy, Users, BookOpen, Play, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0e1111] text-white">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 z-50 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Master Coding Interviews
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Level up your coding skills with our comprehensive collection of algorithm problems, interactive coding
              environment, and expert solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-lg flex items-center justify-center"
                onClick={() => navigate("/problems")}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Coding
              </button>
              <button className="border border-gray-600 text-gray-300 hover:bg-white/10 px-8 py-3 rounded-lg text-lg flex items-center justify-center"
                onClick={() => navigate("/problems")}
              >
                View Problems
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1a1d1f]">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">25+</div>
              <div className="text-gray-400">Problems</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">100+</div>
              <div className="text-gray-400">Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">20+</div>
              <div className="text-gray-400">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">5+</div>
              <div className="text-gray-400">Languages</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose NexCode?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to ace your coding interviews and become a better programmer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Code className="h-12 w-12 text-emerald-400 mb-4" />, title: "Diverse Problem Set", desc: "From easy to hard, covering all major algorithms and data structures" },
              { icon: <Trophy className="h-12 w-12 text-yellow-400 mb-4" />, title: "Weekly Contests", desc: "Compete with developers worldwide and climb the leaderboard" },
              { icon: <Users className="h-12 w-12 text-blue-400 mb-4" />, title: "Community Driven", desc: "Learn from others, share solutions, and get help when stuck" },
              { icon: <BookOpen className="h-12 w-12 text-purple-400 mb-4" />, title: "Detailed Solutions", desc: "Step-by-step explanations with multiple approaches" },
              { icon: <Star className="h-12 w-12 text-orange-400 mb-4" />, title: "Interview Prep", desc: "Curated lists from top tech companies like Google, Meta, Amazon" },
              { icon: <Play className="h-12 w-12 text-green-400 mb-4" />, title: "Online IDE", desc: "Code, test, and debug in your browser with our powerful editor" },
            ].map((card, idx) => (
              <div key={idx} className="bg-[#222222] border border-gray-700 rounded-lg p-6 text-center">
                {card.icon}
                <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-gray-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0e1111]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Level Up?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have improved their coding skills and landed their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-lg"
              onClick={() => navigate("/problems")}
            >
              Get Started Free
            </button>
            <button className="border border-gray-600 text-gray-300 hover:bg-white/10 px-8 py-3 rounded-lg text-lg">
              Explore Premium
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#0e1111] border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-6 w-6 text-emerald-400" />
                <span className="text-lg font-bold">NexCode</span>
              </div>
              <p className="text-gray-400">
                The best platform to help you enhance your skills and ace coding interviews.
              </p>
            </div>
            {[
              {
                title: "Product",
                items: ["Problems", "Contests", "Discuss", "Premium"],
              },
              {
                title: "Company",
                items: ["About", "Careers", "Press", "Contact"],
              },
              {
                title: "Support",
                items: ["Help Center", "Privacy Policy", "Terms of Service", "Status"],
              },
            ].map((group, idx) => (
              <div key={idx}>
                <h3 className="font-semibold mb-4">{group.title}</h3>
                <ul className="space-y-2 text-gray-400">
                  {group.items.map((item, i) => (
                    <li key={i}>
                      <Link to="#" className="hover:text-white transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NexCode. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

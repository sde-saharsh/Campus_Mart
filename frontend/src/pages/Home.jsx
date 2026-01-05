import { Link } from "react-router-dom";
import { FiArrowRight, FiShield, FiUsers, FiDollarSign } from "react-icons/fi";

const Home = () => {
  return (
    <div className="min-h-screen bg-primary transition-colors duration-300">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-primary py-20 lg:py-32">
        <div className="absolute inset-0 opacity-20 dark:opacity-5 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold tracking-wide mb-6 animate-fade-in border border-emerald-200 dark:border-transparent">
            TRUSTED BY STUDENTS
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary leading-tight mb-8 tracking-tight">
            The Campus <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Marketplace</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Buy and sell textbooks, electronics, and dorm essentials securely within your university community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/items"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-600 transition transform hover:-translate-y-1"
            >
              Start Exploring
            </Link>
            <Link
              to="/items/create"
              className="w-full sm:w-auto px-8 py-4 bg-surface text-accent border border-emerald-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm hover:shadow-md"
            >
              Sell an Item
            </Link>
          </div>
        </div>
      </section>

      {/* STATS / TRUST */}
      <section className="border-y border-border-color bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           <StatItem number="500+" label="Active Listings" />
           <StatItem number="1k+" label="Students Verified" />
           <StatItem number="₹50L+" label="Volume Traded" />
           <StatItem number="24/7" label="Support" />
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Why choose CampusMart?</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Designed specifically for student needs, offering a safe and convenient way to trade on campus.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={FiShield} 
            title="Secure Campus Trading" 
            desc="Every user is verified. Trade safely with students from your own college."
          />
          <FeatureCard 
            icon={FiDollarSign} 
            title="Zero Commission" 
            desc="We don't take a cut. Keep 100% of what you sell, always."
          />
          <FeatureCard 
            icon={FiUsers} 
            title="Community Driven" 
            desc="Build connections with seniors and juniors while trading useful items."
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to declutter?</h2>
            <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
              Turn your unused items into cash today. It takes less than 2 minutes to list an item.
            </p>
            <Link
              to="/items/create"
              className="inline-flex items-center gap-2 bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition"
            >
              List Item Now <FiArrowRight />
            </Link>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

    </div>
  );
};

const StatItem = ({ number, label }) => (
  <div>
    <div className="text-3xl md:text-4xl font-extrabold text-text-primary mb-1">{number}</div>
    <div className="text-sm font-medium text-text-secondary uppercase tracking-wider">{label}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-surface p-8 rounded-2xl border border-border-color transition hover:shadow-xl hover:-translate-y-1 duration-300 shadow-sm">
    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:bg-emerald-100 transition">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
    <p className="text-text-secondary leading-relaxed">
      {desc}
    </p>
  </div>
);

export default Home;
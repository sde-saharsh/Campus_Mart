import { Link } from "react-router-dom";
import { FiSearch, FiShield, FiTag, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroRef = useRef(null);
    const bentoRef = useRef(null);
    const inventoryRef = useRef(null);
    
    // Floating items data (Restored)
    const floatingItems = [
        { id: 1, type: "textbook", label: "Calculus", color: "bg-blue-500", x: -20, y: -15 },
        { id: 2, type: "tech", label: "iPad Pro", color: "bg-gray-800", x: 25, y: -25 },
        { id: 3, type: "gear", label: "Lab Coat", color: "bg-white text-gray-800", x: -30, y: 20 },
        { id: 4, type: "camera", label: "Canon EOS", color: "bg-black", x: 20, y: 15 },
        { id: 5, type: "music", label: "Guitar", color: "bg-amber-600", x: -10, y: 35 },
        { id: 6, type: "tool", label: "Drafter", color: "bg-slate-400", x: 35, y: -10 },
    ];

    useLayoutEffect(() => {
        // Initialize Lenis Smooth Scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        const ctx = gsap.context(() => {
            
            // 1. Split-Text Reveal for Hero
            const headline = new SplitType('#hero-headline', { types: 'chars, words' });
            const subhead = new SplitType('#hero-subhead', { types: 'lines' });
            
            gsap.from(headline.chars, {
                y: 20,
                opacity: 0,
                stagger: 0.02,
                duration: 1.2,
                ease: "expo.out",
                delay: 0.2
            });

            gsap.from(subhead.lines, {
                y: 15,
                opacity: 0,
                stagger: 0.1,
                duration: 1,
                ease: "power2.out",
                delay: 0.8
            });

            // 2. Anti-Gravity Physics for Floating Cards
            const floatCards = document.querySelectorAll(".float-card");
            floatCards.forEach((card) => {
                // Random drift
                gsap.to(card, {
                    y: "random(-20, 20)",
                    x: "random(-10, 10)",
                    rotation: "random(-5, 5)",
                    duration: "random(3, 5)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });

            // Mouse Move Parallax
            const handleHeroMouseMove = (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30; // 15px range
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                
                gsap.to(floatCards, {
                    x: -x, // Inverse move
                    y: -y,
                    duration: 1,
                    ease: "power2.out"
                });
            };
            heroRef.current.addEventListener("mousemove", handleHeroMouseMove);

            // 3. Bottom Glow Breathing
            gsap.to(".hero-glow", {
                scale: 1.2,
                opacity: 0.6,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // 4. Bento Grid Reveal
            gsap.from(".bento-box", {
                scrollTrigger: {
                    trigger: bentoRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });

            // 5. Floating Inventory Stagger
            gsap.from(".inventory-item", {
                scrollTrigger: {
                    trigger: inventoryRef.current,
                    start: "top 85%",
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: "power2.out"
            });

        }, [heroRef, bentoRef, inventoryRef]);

        return () => {
             ctx.revert();
             lenis.destroy();
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10] transition-colors duration-500 overflow-x-hidden font-sans">
            
            {/* HERO SECTION - Anti-Gravity */}
            <section ref={heroRef} className="relative min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 overflow-hidden perspective-1000">
                {/* Background - Clean Light / Deep Dark */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-[#0F172A] dark:to-[#020617] -z-20"></div>
                
                <div className="hero-glow absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

                {/* Floating 3D Cards */}
                <div className="absolute inset-0 pointer-events-none z-0">
                   {floatingItems.map((item, i) => (
                       <div 
                           key={item.id} 
                           className={`float-card absolute p-4 rounded-xl glass-panel shadow-xl dark:shadow-2xl backdrop-blur-md hidden md:block border border-white/20 dark:border-white/5 bg-white/40 dark:bg-slate-800/40`}
                           style={{
                               // Distribute roughly in a circle/oval around center
                               top: i === 0 ? '20%' : i === 1 ? '15%' : i === 2 ? '70%' : i === 3 ? '65%' : i === 4 ? '40%' : '50%',
                               left: i === 0 ? '15%' : i === 1 ? '75%' : i === 2 ? '20%' : i === 3 ? '80%' : i === 4 ? '5%' : '90%',
                           }}
                       >
                           <div className={`w-12 h-12 mb-2 rounded-lg ${item.color} opacity-90 shadow-inner flex items-center justify-center text-white font-bold text-lg`}>
                               {item.type === 'textbook' && '📚'}
                               {item.type === 'tech' && '💻'}
                               {item.type === 'gear' && '🥼'}
                               {item.type === 'camera' && '📸'}
                               {item.type === 'music' && '🎸'}
                               {item.type === 'tool' && '📐'}
                           </div>
                           <div className="text-sm font-bold text-slate-800 dark:text-white">{item.label}</div>
                           <div className="h-1 w-8 bg-emerald-500/50 rounded-full mt-1"></div>
                       </div>
                   ))}
                </div>

                {/* Content */}
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <div id="hero-headline" className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-sm">
                        The Campus <br className="hidden md:block"/>
                        <span className="text-emerald-600 dark:text-emerald-500">Secondary Market</span>,  <br className="hidden md:block"/>
                        Optimized.
                    </div>
                    <div id="hero-subhead" className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                        A high-performance trading layer for your university. Liquidate your dorm essentials or find gear in seconds. Commission-free. Verified only.
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/items" className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 transform hover:-translate-y-1">
                            Start Trading <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/items/create" className="px-8 py-4 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-full font-bold text-lg hover:bg-white/80 dark:hover:bg-white/10 transition-colors backdrop-blur-sm">
                            Liquidate Assets
                        </Link>
                    </div>
                </div>
            </section>

            {/* BENTO GRID POWER FEATURES */}
            <section ref={bentoRef} className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[500px]">
                    
                    {/* Box 1: Smart Search (Large) */}
                    <div className="bento-box col-span-1 md:col-span-2 row-span-2 bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-end group hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
                        <div className="absolute top-8 left-8 right-8">
                             <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-3 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                                 <FiSearch className="text-emerald-500" />
                                 <span className="text-slate-500 dark:text-slate-400 font-mono text-sm typing-animation">Searching for "Engineering Graphics"...</span>
                             </div>
                             <div className="mt-4 space-y-2 opacity-50">
                                 <div className="h-2 w-3/4 bg-slate-200 dark:bg-white/10 rounded"></div>
                                 <div className="h-2 w-1/2 bg-slate-200 dark:bg-white/10 rounded"></div>
                             </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Smart Search</h3>
                            <p className="text-slate-600 dark:text-slate-400">Find exactly what you need with semantic matching.</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Box 2: Safe Zones (Small) */}
                    <div className="bento-box md:col-span-1 bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors relative overflow-hidden backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 animate-pulse">
                            <FiCheckCircle size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Safe Zones</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Verified trading spots.</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 dark:opacity-10 rotate-12 text-slate-900 dark:text-white">
                             <FiShield size={100} />
                        </div>
                    </div>

                    {/* Box 3: No Fees (Small) */}
                    <div className="bento-box md:col-span-1 bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 font-mono font-bold">
                            ₹
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">0% Fees</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Keep 100% of profit.</p>
                        </div>
                    </div>

                    {/* Box 4: Verified Only (Medium) */}
                    <div className="bento-box md:col-span-2 bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-3xl p-8 flex items-center justify-between group hover:border-emerald-500/30 transition-colors relative overflow-hidden backdrop-blur-sm">
                         <div className="relative z-10 max-w-[60%]">
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verified Students Only</h3>
                             <p className="text-sm text-slate-600 dark:text-slate-400">Closed ecosystem. No outsiders, no bots. Just your peers.</p>
                         </div>
                         <div className="relative z-10 w-24 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-lg rotate-6 flex items-center justify-center text-white/90 font-mono text-[10px] tracking-widest border border-white/20">
                             ID CARD
                             <div className="absolute inset-0 bg-white/30 animate-scan-y"></div>
                         </div>
                    </div>

                </div>
            </section>

             {/* FLOATING INVENTORY PREVIEW */}
            <section ref={inventoryRef} className="py-20 px-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Live Market</h2>
                        <p className="text-slate-600 dark:text-slate-400">Real-time liquidity from across campus.</p>
                    </div>
                     <Link to="/items" className="text-emerald-500 font-bold hover:underline flex items-center gap-1">
                        View All Assets <FiArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Mock Items for Display */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="inventory-item group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow">
                            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"></div> 
                            {/* Placeholder for real images. In real app, map real items */}
                            <img 
                                src={`https://source.unsplash.com/random/400x500?tech,book&sig=${i}`} 
                                alt="Item" 
                                className="absolute inset-0 w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => e.target.style.display = 'none'} // Fallback if unsplash fails
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="text-white font-bold text-lg mb-1">Available Item #{i}</div>
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-400 font-mono font-bold">₹{i * 450}</span>
                                    <span className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">4m ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;
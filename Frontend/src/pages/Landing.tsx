import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Heart,
	Shield,
	Users,
	ArrowRight,
	Smartphone,
	MessageCircle,
	Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import DemoScript from "@/components/DemoScript";

const Landing = () => {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="gradient-hero px-4 py-16 text-center relative overflow-hidden">
				<div className="max-w-4xl mx-auto relative z-10">
					<div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-6">
						<Shield className="w-4 h-4 mr-2" />
						Trusted by 500+ hospitals
					</div>

					<h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
						Your Recovery,
						<br />
						<span className="text-white/90">Guided & Connected</span>
					</h1>

					<p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
						PostOpCare+ supports your healing journey with personalized recovery
						plans, daily check-ins, and direct connection to your care team.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Link to="/onboarding">
							<Button
								variant="hero"
								size="lg"
								className="w-full transition-transform duration-300 sm:w-auto text-lg"
							>
								Start my recovery plan
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</Link>
						<Button
							variant="ghost-light"
							size="lg"
							className="w-full transition-colors duration-200 hover:bg-white hover:text-blue-500 sm:w-auto text-lg"
						>
							Watch demo
						</Button>
					</div>
				</div>

				{/* Decorative background elements */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
				<div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
			</div>

			{/* Features Section */}
			<div className="py-16 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-foreground mb-4">
							Everything you need for a smooth recovery
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							From surgery to full recovery, we're with you every step of the
							way
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="bg-card rounded-2xl p-6 shadow-card transition-smooth hover:shadow-xl">
							<div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
								<Smartphone className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3">
								Smart Daily Check-ins
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								Adaptive conversations that learn from your responses and adjust
								questions based on your recovery progress.
							</p>
						</div>

						<div className="bg-card rounded-2xl p-6 shadow-card transition-smooth hover:shadow-xl">
							<div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center mb-4">
								<Camera className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3">
								Visual Wound Monitoring
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								Guided photo capture with AI analysis to track healing progress
								and detect early warning signs.
							</p>
						</div>

						<div className="bg-card rounded-2xl p-6 shadow-card transition-smooth hover:shadow-xl">
							<div className="w-12 h-12 bg-alert rounded-xl flex items-center justify-center mb-4">
								<MessageCircle className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3">
								Direct Care Team Access
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								Instant alerts to your medical team when intervention is needed,
								with secure messaging and video calls.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Section */}
			<div className="gradient-subtle py-16 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl font-bold text-white mb-12">
						Proven results for better outcomes
					</h2>

					<div className="grid md:grid-cols-3 gap-8">
						<div>
							<div className="text-4xl font-bold text-primary mb-2">68%</div>
							<div className="text-white/70">Fewer readmissions</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-success mb-2">12</div>
							<div className="text-white/70">Languages supported</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-primary mb-2">24/7</div>
							<div className="text-white/70">Care team monitoring</div>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="py-16 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl font-bold text-foreground mb-6">
						Ready to start your recovery journey?
					</h2>
					<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
						Join thousands of patients who've experienced faster, safer recovery
						with PostOpCare+
					</p>

					<Link to="/onboarding">
						<Button
							variant="primary"
							size="lg"
							className="text-lg transition-transform duration-300 hover:scale-105"
						>
							Start my recovery plan
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</Link>
				</div>
			</div>

			{/* Demo Script */}
			<DemoScript />
		</div>
	);
};

export default Landing;

import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle2, ArrowRight, Zap, Target, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCreateLead } from "@/hooks/use-leads";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter a valid phone number"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LandingPage() {
  const { toast } = useToast();
  const createLead = useCreateLead();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createLead.mutateAsync(values);
      form.reset();
      toast({
        title: "Success!",
        description: "We've received your information. We'll be in touch shortly.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy */}
          <motion.div 
            className="lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <Zap size={16} />
              <span>The #1 tool for growing businesses</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground">
              Capture more <span className="text-gradient">qualified leads</span> effortlessly.
            </motion.h1>
            
            <motion.p variants={itemVariants} className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Turn your website visitors into paying customers. Simple, powerful, and designed for modern teams who want to scale faster.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-10 grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Target size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">High Conversion</h3>
                  <p className="text-sm text-muted-foreground mt-1">Optimized forms designed to convert traffic.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BarChart3 size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Real-time Data</h3>
                  <p className="text-sm text-muted-foreground mt-1">See your leads instantly in the dashboard.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            className="lg:col-span-5 lg:pl-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 24 }}
          >
            <Card className="p-8 sm:p-10 glass-card">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">Get Started Today</h2>
                <p className="text-muted-foreground mt-2">Fill out the form and our team will reach out to you.</p>
              </div>

              {createLead.isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">You're on the list!</h3>
                  <p className="text-muted-foreground mt-2">We'll be in touch with you very soon.</p>
                  <Button 
                    variant="outline" 
                    className="mt-6 w-full"
                    onClick={() => createLead.reset()}
                  >
                    Submit another
                  </Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-foreground font-medium">Full Name</Label>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              className="h-12 bg-background/50 focus:bg-background transition-colors" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-foreground font-medium">Work Email</Label>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@company.com" 
                              className="h-12 bg-background/50 focus:bg-background transition-colors" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-foreground font-medium">Phone Number</Label>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="+1 (555) 000-0000" 
                              className="h-12 bg-background/50 focus:bg-background transition-colors" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
                      disabled={createLead.isPending}
                    >
                      {createLead.isPending ? "Submitting..." : "Get Free Access"}
                      {!createLead.isPending && <ArrowRight size={18} className="ml-2" />}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      By submitting, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </form>
                </Form>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Stethoscope, 
  Shield, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink
} from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Drug Interaction Checker", href: "#" },
        { name: "Dosage Calculator", href: "#" },
        { name: "Patient Dashboard", href: "#" },
        { name: "Clinical Reports", href: "#" }
      ]
    },
    {
      title: "For Professionals",
      links: [
        { name: "Healthcare Providers", href: "#" },
        { name: "Pharmacists", href: "#" },
        { name: "Researchers", href: "#" },
        { name: "API Documentation", href: "#" }
      ]
    },
    {
      title: "Compliance",
      links: [
        { name: "HIPAA Compliance", href: "#" },
        { name: "FDA Validation", href: "#" },
        { name: "Security Standards", href: "#" },
        { name: "Privacy Policy", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Training Resources", href: "#" },
        { name: "System Status", href: "#" },
        { name: "Contact Support", href: "#" }
      ]
    }
  ];

  const certifications = [
    { name: "HIPAA", icon: Shield },
    { name: "FDA", icon: Shield },
    { name: "SOC 2", icon: Shield },
    { name: "ISO 27001", icon: Shield }
  ];

  return (
    <footer className="bg-gradient-to-br from-muted to-background border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start mb-12">
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    PharmaLytics Nexus
                  </h3>
                  <p className="text-muted-foreground">Advanced Drug Safety Platform</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-md">
                Empowering healthcare professionals with AI-powered drug interaction analysis, 
                personalized dosage recommendations, and comprehensive safety monitoring.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" />
                support@pharmalytics-nexus.com
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                +1 (555) 123-DRUG
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                Healthcare Innovation Hub, CA
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center group"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="mb-8" />

          {/* Certifications */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-primary" />
              Security & Compliance Certifications
            </h4>
            <div className="flex flex-wrap gap-3">
              {certifications.map((cert, index) => {
                const Icon = cert.icon;
                return (
                  <Badge key={index} variant="outline" className="px-3 py-2">
                    <Icon className="w-3 h-3 mr-2" />
                    {cert.name} Compliant
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 PharmaLytics Nexus. All rights reserved. | 
              <span className="ml-1">Built with Lovable</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Globe className="w-3 h-3 mr-1" />
                Available in 50+ Countries
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                99.7% Uptime SLA
              </Badge>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg border-dashed border-2 border-primary/20">
            <p className="text-center text-sm text-muted-foreground">
              <strong>Demo Environment:</strong> This is a demonstration of the PharmaLytics Nexus platform interface. 
              Real clinical functionality requires proper medical databases, regulatory approvals, and healthcare provider validation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
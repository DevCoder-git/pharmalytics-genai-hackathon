import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Flag,
  Search,
  Download
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface DrugApproval {
  country: string;
  countryCode: string;
  status: 'approved' | 'rejected' | 'pending' | 'withdrawn';
  approvalDate?: string;
  rejectionReason?: string;
  regulatoryBody: string;
  approvalNumber?: string;
  conditions?: string[];
  restrictions?: string[];
}

interface DrugInformation {
  name: string;
  genericName: string;
  manufacturer: string;
  drugClass: string;
  approvals: DrugApproval[];
}

const countries = [
  { code: 'US', name: 'United States', regulatory: 'FDA' },
  { code: 'CA', name: 'Canada', regulatory: 'Health Canada' },
  { code: 'GB', name: 'United Kingdom', regulatory: 'MHRA' },
  { code: 'DE', name: 'Germany', regulatory: 'BfArM' },
  { code: 'FR', name: 'France', regulatory: 'ANSM' },
  { code: 'JP', name: 'Japan', regulatory: 'PMDA' },
  { code: 'AU', name: 'Australia', regulatory: 'TGA' },
  { code: 'BR', name: 'Brazil', regulatory: 'ANVISA' },
  { code: 'IN', name: 'India', regulatory: 'CDSCO' },
  { code: 'CN', name: 'China', regulatory: 'NMPA' },
  { code: 'EU', name: 'European Union', regulatory: 'EMA' },
  { code: 'KR', name: 'South Korea', regulatory: 'MFDS' }
];

export function RegionalDrugApproval() {
  const [drugName, setDrugName] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [drugInfo, setDrugInfo] = useState<DrugInformation | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const checkDrugApproval = async () => {
    if (!drugName.trim()) {
      toast.error('Please enter a drug name');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to check drug approval status
      // In real implementation, this would call regulatory databases
      
      const mockApprovals: DrugApproval[] = countries.map(country => {
        const isApproved = Math.random() > 0.3; // 70% chance of approval
        const isPending = !isApproved && Math.random() > 0.5;
        
        let status: DrugApproval['status'];
        if (isApproved) status = 'approved';
        else if (isPending) status = 'pending';
        else status = 'rejected';

        const approval: DrugApproval = {
          country: country.name,
          countryCode: country.code,
          status,
          regulatoryBody: country.regulatory,
        };

        if (status === 'approved') {
          approval.approvalDate = new Date(2020 + Math.random() * 4, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
          approval.approvalNumber = `${country.code}-${Math.floor(Math.random() * 10000)}`;
          if (Math.random() > 0.7) {
            approval.conditions = ['Prescription only', 'Adult patients only'];
          }
          if (Math.random() > 0.8) {
            approval.restrictions = ['Contraindicated in pregnancy'];
          }
        } else if (status === 'rejected') {
          const reasons = [
            'Insufficient safety data',
            'Unfavorable benefit-risk profile',
            'Manufacturing quality concerns',
            'Incomplete clinical trial data'
          ];
          approval.rejectionReason = reasons[Math.floor(Math.random() * reasons.length)];
        }

        return approval;
      });

      const mockDrugInfo: DrugInformation = {
        name: drugName,
        genericName: drugName.toLowerCase().replace(/\s+/g, '_'),
        manufacturer: 'Pharmaceutical Company Inc.',
        drugClass: 'Cardiovascular Agent',
        approvals: selectedCountries.length > 0 
          ? mockApprovals.filter(a => selectedCountries.includes(a.countryCode))
          : mockApprovals
      };

      setDrugInfo(mockDrugInfo);
      
      // Add to search history
      if (!searchHistory.includes(drugName)) {
        setSearchHistory(prev => [drugName, ...prev.slice(0, 4)]);
      }

      toast.success('Drug approval status retrieved');
    } catch (error) {
      toast.error('Failed to check drug approval status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'withdrawn': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'withdrawn': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const approvedCount = drugInfo?.approvals.filter(a => a.status === 'approved').length || 0;
  const rejectedCount = drugInfo?.approvals.filter(a => a.status === 'rejected').length || 0;
  const pendingCount = drugInfo?.approvals.filter(a => a.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Drug Approval Checker
          </CardTitle>
          <CardDescription>
            Verify drug approval status across different countries and regulatory regions
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Drug Search</TabsTrigger>
          <TabsTrigger value="results">Approval Status</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle>Drug Approval Search</CardTitle>
              <CardDescription>
                Enter drug name to check approval status across regions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="drug-name">Drug Name</Label>
                <Input
                  id="drug-name"
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  placeholder="e.g., Lisinopril, Atorvastatin"
                  onKeyPress={(e) => e.key === 'Enter' && checkDrugApproval()}
                />
              </div>

              <div>
                <Label>Countries/Regions (Optional)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                  {countries.map(country => (
                    <label key={country.code} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCountries(prev => [...prev, country.code]);
                          } else {
                            setSelectedCountries(prev => prev.filter(c => c !== country.code));
                          }
                        }}
                      />
                      <Flag className="h-3 w-3" />
                      <span>{country.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to check all regions
                </p>
              </div>

              <Button onClick={checkDrugApproval} disabled={loading} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Checking Approval Status...' : 'Check Drug Approval'}
              </Button>
            </CardContent>
          </Card>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Searches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((drug, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setDrugName(drug)}
                    >
                      {drug}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {!drugInfo ? (
            <Card>
              <CardContent className="text-center py-12">
                <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Search Results</h3>
                <p className="text-muted-foreground">
                  Search for a drug to view approval status across regions
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Drug Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>{drugInfo.name}</CardTitle>
                  <CardDescription>
                    {drugInfo.genericName} • {drugInfo.drugClass} • {drugInfo.manufacturer}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
                      <p className="text-sm text-muted-foreground">Rejected</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{drugInfo.approvals.length}</div>
                      <p className="text-sm text-muted-foreground">Total Regions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Approval Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Regional Approval Status</CardTitle>
                  <CardDescription>
                    Detailed approval information by country/region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {drugInfo.approvals.map((approval, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Flag className="h-5 w-5" />
                            <div>
                              <h4 className="font-medium">{approval.country}</h4>
                              <p className="text-sm text-muted-foreground">{approval.regulatoryBody}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(approval.status)}
                            <Badge className={getStatusColor(approval.status)}>
                              {approval.status}
                            </Badge>
                          </div>
                        </div>

                        {approval.status === 'approved' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {approval.approvalDate && (
                              <div>
                                <span className="font-medium">Approval Date:</span>
                                <span className="ml-2">{approval.approvalDate}</span>
                              </div>
                            )}
                            {approval.approvalNumber && (
                              <div>
                                <span className="font-medium">Approval Number:</span>
                                <span className="ml-2">{approval.approvalNumber}</span>
                              </div>
                            )}
                            {approval.conditions && (
                              <div className="md:col-span-2">
                                <span className="font-medium">Conditions:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {approval.conditions.map((condition, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {condition}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {approval.restrictions && (
                              <div className="md:col-span-2">
                                <span className="font-medium">Restrictions:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {approval.restrictions.map((restriction, i) => (
                                    <Badge key={i} variant="outline" className="text-xs bg-yellow-100">
                                      {restriction}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {approval.status === 'rejected' && approval.rejectionReason && (
                          <div className="text-sm">
                            <span className="font-medium">Rejection Reason:</span>
                            <span className="ml-2 text-red-600">{approval.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Generate compliance reports for regulatory submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Global Approval Summary</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Complete overview of approval status across all regions
                      </p>
                      <Button size="sm" className="w-full">
                        <Download className="mr-2 h-3 w-3" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Regulatory Timeline</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Chronological timeline of approvals and submissions
                      </p>
                      <Button size="sm" className="w-full">
                        <Download className="mr-2 h-3 w-3" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Pending Applications</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Status tracking for pending regulatory applications
                      </p>
                      <Button size="sm" className="w-full">
                        <Download className="mr-2 h-3 w-3" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Compliance Matrix</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Regional compliance requirements and status matrix
                      </p>
                      <Button size="sm" className="w-full">
                        <Download className="mr-2 h-3 w-3" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
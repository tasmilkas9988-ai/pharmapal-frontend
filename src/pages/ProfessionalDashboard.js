import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Pill, LogOut, Database, Users, TrendingUp, AlertCircle } from "lucide-react";

const ProfessionalDashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [language, setLanguage] = useState(user?.language || "ar");
  const [stats, setStats] = useState({
    totalMedications: 0,
    interactions: 0,
    patients: 0,
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await axios.get(`${API}/medications`);
      setMedications(response.data);
      setStats({
        totalMedications: response.data.length,
        interactions: response.data.reduce((acc, med) => acc + med.interactions.length, 0),
        patients: 0,
      });
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const content = {
    en: {
      dashboard: "Professional Dashboard",
      sfdaDatabase: "SFDA Database",
      analytics: "Analytics",
      totalMeds: "Total Medications",
      interactions: "Known Interactions",
      patients: "Patients (Demo)",
      logout: "Logout",
      welcome: "Welcome, Dr.",
      advancedTools: "Advanced Professional Tools",
      toolsDesc: "Access detailed pharmaceutical analytics and patient management",
    },
    ar: {
      dashboard: "لوحة التحكم المهنية",
      sfdaDatabase: "قاعدة بيانات الهيئة",
      analytics: "التحليلات",
      totalMeds: "إجمالي الأدوية",
      interactions: "التفاعلات المعروفة",
      patients: "المرضى (تجريبي)",
      logout: "تسجيل الخروج",
      welcome: "مرحباً، د.",
      advancedTools: "أدوات مهنية متقدمة",
      toolsDesc: "الوصول إلى التحليلات الدوائية التفصيلية وإدارة المرضى",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" data-testid="professional-dashboard">
      {/* Navigation */}
      <nav className="glass border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Pill className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold gradient-text" data-testid="pro-dashboard-title">PharmaPal Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600" data-testid="pro-user-welcome">
              {t.welcome} {user?.full_name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              data-testid="pro-lang-toggle"
            >
              {language === "en" ? "العربية" : "English"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} data-testid="pro-logout-btn">
              <LogOut className="w-4 h-4 mr-2" />
              {t.logout}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100" data-testid="stat-medications">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Database className="w-6 h-6" />
                {t.totalMeds}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-900" data-testid="stat-medications-value">{stats.totalMedications}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-amber-50 to-amber-100" data-testid="stat-interactions">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="w-6 h-6" />
                {t.interactions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-amber-900" data-testid="stat-interactions-value">{stats.interactions}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100" data-testid="stat-patients">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Users className="w-6 h-6" />
                {t.patients}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-900" data-testid="stat-patients-value">{stats.patients}</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Tools Section */}
        <Card className="shadow-lg mb-8" data-testid="advanced-tools-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              {t.advancedTools}
            </CardTitle>
            <CardDescription>{t.toolsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">
                {language === "en"
                  ? "Advanced analytics, prescription management, and patient monitoring tools available in premium version"
                  : "التحليلات المتقدمة وإدارة الوصفات الطبية وأدوات مراقبة المرضى متاحة في النسخة المميزة"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SFDA Database */}
        <Card className="shadow-lg" data-testid="sfda-database-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-600" />
              {t.sfdaDatabase}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medications.map((med, idx) => (
                <Card key={med.id} className="bg-gray-50" data-testid={`pro-medication-${idx}`}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <h4 className="font-semibold" data-testid={`pro-med-name-${idx}`}>
                          {language === "ar" ? med.commercial_name_ar : med.commercial_name_en}
                        </h4>
                        <p className="text-sm text-gray-600" data-testid={`pro-med-scientific-${idx}`}>{med.scientific_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500" data-testid={`pro-med-sfda-${idx}`}>
                          <strong>SFDA:</strong> {med.sfda_code}
                        </p>
                        <p className="text-xs text-gray-500" data-testid={`pro-med-dosage-${idx}`}>
                          <strong>Dosage:</strong> {med.dosage_strength}
                        </p>
                        <p className="text-xs text-amber-600 mt-1" data-testid={`pro-med-interactions-${idx}`}>
                          <strong>Interactions:</strong> {med.interactions.length} known
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;

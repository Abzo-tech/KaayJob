import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - redirect to dashboard
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000080] to-[#001a99] flex items-center justify-center py-12 px-4 pt-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-[#FFF4EA] mb-2">KaayJob</h1>
          <p className="text-[#FFF4EA] text-lg">
            Connectez-vous avec des prestataires de confiance
          </p>
        </div>

        <Card
          className="shadow-2xl border-0 bg-white/95 backdrop-blur animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="bg-gradient-to-r from-[#000080] to-[#001a99]">
            <CardTitle className="text-center text-white text-2xl">
              Commencer
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger
                  value="customer"
                  className="text-base data-[state=active]:bg-[#000080] data-[state=active]:text-white"
                >
                  Client
                </TabsTrigger>
                <TabsTrigger
                  value="provider"
                  className="text-base data-[state=active]:bg-[#000080] data-[state=active]:text-white"
                >
                  Prestataire
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Connexion</TabsTrigger>
                    <TabsTrigger value="signup">S'inscrire</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Entrez votre email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Entrez votre mot de passe"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-base py-3"
                      >
                        Connexion
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Entrez votre nom complet"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email-signup">Email</Label>
                        <Input
                          id="email-signup"
                          type="email"
                          placeholder="Entrez votre email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Numéro de téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Entrez votre numéro de téléphone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password-signup">Mot de passe</Label>
                        <Input
                          id="password-signup"
                          type="password"
                          placeholder="Créer un mot de passe"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-base py-3"
                      >
                        S'inscrire
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="provider">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Connexion</TabsTrigger>
                    <TabsTrigger value="signup">S'inscrire</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="provider-email">Email</Label>
                        <Input
                          id="provider-email"
                          type="email"
                          placeholder="Entrez votre email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="provider-password">Mot de passe</Label>
                        <Input
                          id="provider-password"
                          type="password"
                          placeholder="Entrez votre mot de passe"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-base py-3"
                      >
                        Connexion Prestataire
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="provider-name">
                          Nom de l'entreprise
                        </Label>
                        <Input
                          id="provider-name"
                          type="text"
                          placeholder="Entrez le nom de votre entreprise"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="provider-email-signup">Email</Label>
                        <Input
                          id="provider-email-signup"
                          type="email"
                          placeholder="Entrez l'email de votre entreprise"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="provider-phone">
                          Numéro de téléphone
                        </Label>
                        <Input
                          id="provider-phone"
                          type="tel"
                          placeholder="Entrez le téléphone de votre entreprise"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="provider-password-signup">
                          Mot de passe
                        </Label>
                        <Input
                          id="provider-password-signup"
                          type="password"
                          placeholder="Créer un mot de passe"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="mt-1 text-base"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-base py-3"
                      >
                        S'inscrire en tant que Prestataire
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate("home")}
            className="text-blue-600 hover:text-blue-800 text-base"
          >
            ← Retour à l'Accueil
          </button>
        </div>
      </div>
    </div>
  );
}

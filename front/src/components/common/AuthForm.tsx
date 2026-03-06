import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { PasswordInput, EmailInput, TextInput } from "../forms";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface AuthFormProps {
  userType: "customer" | "provider" | "admin";
  activeTab: "login" | "signup";
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isLoading: boolean;
  onUserTypeChange: (type: "customer" | "provider" | "admin") => void;
  onTabChange: (tab: "login" | "signup") => void;
  onInputChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
  onSubmit: (e: React.FormEvent, isSignup: boolean) => void;
  onNavigate: (page: string) => void;
}

export function AuthForm({
  userType,
  activeTab,
  formData,
  errors,
  touched,
  isLoading,
  onUserTypeChange,
  onTabChange,
  onInputChange,
  onBlur,
  onSubmit,
  onNavigate,
}: AuthFormProps) {
  const renderLoginForm = (prefix: string, buttonText: string) => (
    <form onSubmit={(e) => onSubmit(e, false)} className="space-y-3">
      <EmailInput
        id={`${prefix}-email`}
        label="Email"
        value={formData.email}
        onChange={(value) => onInputChange("email", value)}
        onBlur={() => onBlur("email")}
        placeholder="exemple@email.com"
        error={errors.email}
        touched={touched.email}
      />
      <PasswordInput
        id={`${prefix}-password`}
        label="Mot de passe"
        value={formData.password}
        onChange={(value) => onInputChange("password", value)}
        onBlur={() => onBlur("password")}
        placeholder=" minimum 8 caractères"
        error={errors.password}
        touched={touched.password}
      />
      <Button
        type="submit"
        className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 text-base py-3 backdrop-blur"
        disabled={isLoading}
      >
        {buttonText}
      </Button>
    </form>
  );

  const renderSignupForm = (prefix: string, nameLabel: string, buttonText: string) => (
    <form onSubmit={(e) => onSubmit(e, true)} className="space-y-3">
      <TextInput
        id={`${prefix}-name`}
        label={nameLabel}
        value={formData.firstName}
        onChange={(value) => onInputChange("firstName", value)}
        onBlur={() => onBlur("name")}
        placeholder={nameLabel === "Nom complet" ? "Entrez votre nom complet" : "Entrez le nom de votre entreprise"}
        error={errors.name}
        touched={touched.name}
        required
      />
      <EmailInput
        id={`${prefix}-email-signup`}
        label="Email"
        value={formData.email}
        onChange={(value) => onInputChange("email", value)}
        onBlur={() => onBlur("email")}
        placeholder="exemple@email.com"
        error={errors.email}
        touched={touched.email}
        required
      />
      <TextInput
        id={`${prefix}-phone`}
        label="Numéro de téléphone"
        value={formData.phone}
        onChange={(value) => onInputChange("phone", value)}
        onBlur={() => onBlur("phone")}
        placeholder="+221771234567"
        error={errors.phone}
        touched={touched.phone}
        required
        type="tel"
      />
      <PasswordInput
        id={`${prefix}-password-signup`}
        label="Mot de passe"
        value={formData.password}
        onChange={(value) => onInputChange("password", value)}
        onBlur={() => onBlur("password")}
        placeholder="Min. 8 caractères (majuscule, minuscule, chiffre)"
        error={errors.password}
        touched={touched.password}
        required
      />
      <PasswordInput
        id={`${prefix}-confirmPassword`}
        label="Confirmer le mot de passe"
        value={formData.confirmPassword}
        onChange={(value) => onInputChange("confirmPassword", value)}
        onBlur={() => onBlur("confirmPassword")}
        placeholder="Répétez votre mot de passe"
        error={errors.confirmPassword}
        touched={touched.confirmPassword}
        required
      />
      <Button
        type="submit"
        className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 text-base py-3 backdrop-blur"
        disabled={isLoading}
      >
        {buttonText}
      </Button>
    </form>
  );

  return (
    <Card
      className="shadow-2xl border-0 animate-slide-up"
      style={{
        animationDelay: "0.1s",
        background: "rgba(255, 255, 255, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "16px",
      }}
    >
      <CardHeader
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <CardTitle className="text-center text-white text-2xl font-bold">
          {userType === "admin" ? "Administration" : "Connexion"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4" style={{ background: "transparent" }}>
        <Tabs
          value={userType}
          className="w-full"
          onValueChange={(value) => onUserTypeChange(value as "customer" | "provider" | "admin")}
        >
          <TabsList
            className="grid w-full grid-cols-3 mb-4 h-10"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
            }}
          >
            <TabsTrigger
              value="customer"
              className="text-sm text-white/80 data-[state=active]:bg-[#000080] data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200 h-8"
            >
              Client
            </TabsTrigger>
            <TabsTrigger
              value="provider"
              className="text-sm text-white/80 data-[state=active]:bg-[#000080] data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200 h-8"
            >
              Prestataire
            </TabsTrigger>
            <TabsTrigger
              value="admin"
              className="text-sm text-white/80 data-[state=active]:bg-[#000080] data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200 h-8"
            >
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Customer Tab */}
          <TabsContent value="customer">
            <Tabs
              value={activeTab}
              className="w-full"
              onValueChange={(v) => onTabChange(v as "login" | "signup")}
            >
              <TabsList
                className="grid w-full grid-cols-2 mb-6"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <TabsTrigger
                  value="login"
                  className="text-white/80 data-[state=active]:bg-[#000080] data-[state=active]:text-white font-semibold transition-all duration-200"
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-white/80 data-[state=active]:bg-[#000080] data-[state=active]:text-white font-semibold transition-all duration-200"
                >
                  S'inscrire
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                {renderLoginForm("customer", "Connexion")}
              </TabsContent>

              <TabsContent value="signup">
                {renderSignupForm("customer", "Nom complet", "S'inscrire")}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Provider Tab */}
          <TabsContent value="provider">
            <Tabs
              value={activeTab}
              className="w-full"
              onValueChange={(v) => onTabChange(v as "login" | "signup")}
            >
              <TabsList
                className="grid w-full grid-cols-2 mb-6"
                style={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <TabsTrigger
                  value="login"
                  className="text-white/80 data-[state=active]:bg-[#000080] data-[state=active]:text-white font-semibold transition-all duration-200"
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-white/80 data-[state=active]:bg-[#000080] data-[state=active]:text-white font-semibold transition-all duration-200"
                >
                  S'inscrire
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                {renderLoginForm("provider", "Connexion Prestataire")}
              </TabsContent>

              <TabsContent value="signup">
                {renderSignupForm("provider", "Nom de l'entreprise", "S'inscrire en tant que Prestataire")}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin">
            {renderLoginForm("admin", "Connexion Admin")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

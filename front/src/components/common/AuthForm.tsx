import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { PasswordInput, EmailInput, TextInput } from "../forms";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AuthFormProps {
  activeTab: "login" | "signup";
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role?: "customer" | "provider" | "admin";
  };
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isLoading: boolean;
  onTabChange: (tab: "login" | "signup") => void;
  onInputChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
  onSubmit: (e: React.FormEvent, isSignup: boolean) => void;
  onNavigate: (page: string) => void;
}

export function AuthForm({
  activeTab,
  formData,
  errors,
  touched,
  isLoading,
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

  const renderSignupForm = () => (
    <form onSubmit={(e) => onSubmit(e, true)} className="space-y-3">
      {/* Sélecteur de rôle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/90">
          Je m'inscris en tant que :
        </label>
        <Select
          value={formData.role || ""}
          onValueChange={(value) => onInputChange("role", value)}
        >
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Sélectionnez votre rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Client - Je cherche des services</SelectItem>
            <SelectItem value="provider">Prestataire - Je propose des services</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && touched.role && (
          <p className="text-red-300 text-sm">{errors.role}</p>
        )}
      </div>

      <TextInput
        id="signup-name"
        label={formData.role === "provider" ? "Nom de l'entreprise" : "Nom complet"}
        value={formData.firstName}
        onChange={(value) => onInputChange("firstName", value)}
        onBlur={() => onBlur("name")}
        placeholder={formData.role === "provider" ? "Entrez le nom de votre entreprise" : "Entrez votre nom complet"}
        error={errors.name}
        touched={touched.name}
        required
      />
      <EmailInput
        id="signup-email"
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
        id="signup-phone"
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
        id="signup-password"
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
        id="signup-confirmPassword"
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
        S'inscrire
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
          Connexion
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4" style={{ background: "transparent" }}>
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
            <form onSubmit={(e) => onSubmit(e, false)} className="space-y-3">
              <EmailInput
                id="login-email"
                label="Email"
                value={formData.email}
                onChange={(value) => onInputChange("email", value)}
                onBlur={() => onBlur("email")}
                placeholder="exemple@email.com"
                error={errors.email}
                touched={touched.email}
              />
              <PasswordInput
                id="login-password"
                label="Mot de passe"
                value={formData.password}
                onChange={(value) => onInputChange("password", value)}
                onBlur={() => onBlur("password")}
                placeholder="Votre mot de passe"
                error={errors.password}
                touched={touched.password}
              />
              <Button
                type="submit"
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 text-base py-3 backdrop-blur"
                disabled={isLoading}
              >
                Se connecter
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            {renderSignupForm()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

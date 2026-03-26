import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Users,
  Target,
  Heart,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { label: "Prestataires actifs", value: "500+", icon: Users },
  { label: "Services rendus", value: "10,000+", icon: CheckCircle },
  { label: "Note moyenne", value: "4.8/5", icon: Star },
  { label: "Années d'expérience", value: "5+", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Excellence",
    description: "Nous nous engageons à fournir des services de la plus haute qualité à nos clients.",
  },
  {
    icon: Users,
    title: "Confiance",
    description: "La confiance est au cœur de nos relations avec nos clients et prestataires.",
  },
  {
    icon: Target,
    title: "Innovation",
    description: "Nous innovons constamment pour améliorer l'expérience utilisateur.",
  },
  {
    icon: Award,
    title: "Intégrité",
    description: "Nous agissons toujours avec honnêteté et transparence.",
  },
];

const team = [
  {
    name: "Mamadou Diallo",
    role: "Fondateur & CEO",
    bio: "Expert en développement digital avec plus de 10 ans d'expérience.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Aïssatou Sow",
    role: "Directrice Marketing",
    bio: "Spécialiste du marketing digital et de la stratégie de marque.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Cheikh Ndiaye",
    role: "Directeur Technique",
    bio: "Développeur full-stack passionné par les technologies innovantes.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#000080] to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            À Propos de KaayJob
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            La plateforme de référence pour connecter les meilleurs artisans avec des clients exigeants au Sénégal.
          </p>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-6">
                Qui sommes-nous
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  KaayJob est née d'une vision simple : faciliter l'accès aux services de qualité pour tous les Sénégalais. Notre plateforme révolutionne la façon dont les particuliers et les entreprises trouvent et réservent des prestataires de services.
                </p>
                <p>
                  Nous croyons que chaque artisan mérite d'être reconnu pour son expertise, et que chaque client mérite un service professionnel et fiable. C'est pourquoi nous avons créé une communauté où la qualité, la confiance et l'excellence sont les maîtres-mots.
                </p>
                <p>
                  Depuis notre lancement, nous avons aidé des milliers de clients à trouver les meilleurs artisans pour leurs projets, contribuant ainsi au développement économique local et à l'amélioration des services au Sénégal.
                </p>
              </div>
              <Button
                onClick={() => onNavigate("categories")}
                className="mt-8 bg-[#000080] hover:bg-blue-700 text-white px-8 py-3"
              >
                Explorer nos services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Équipe KaayJob"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#FFF4EA] rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#000080] rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-[#000080]">4.8/5</p>
                    <p className="text-sm text-gray-600">Note moyenne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-20 px-4 bg-[#000080] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              KaayJob en chiffres
            </h2>
            <p className="text-xl opacity-90">
              Notre impact sur l'économie locale
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              Notre Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Révolutionner l'accès aux services professionnels au Sénégal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <Target className="w-16 h-16 text-[#000080] mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Connecter</h3>
                <p className="text-gray-600">
                  Créer un pont entre les clients exigeants et les meilleurs artisans du Sénégal, facilitant l'accès aux services de qualité.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <Award className="w-16 h-16 text-[#000080] mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Valoriser</h3>
                <p className="text-gray-600">
                  Mettre en valeur l'expertise et le savoir-faire des artisans locaux, contribuant au développement économique du pays.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent>
                <CheckCircle className="w-16 h-16 text-[#000080] mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Simplifier</h3>
                <p className="text-gray-600">
                  Rendre le processus de recherche et de réservation de services aussi simple et intuitif que possible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600">
              Les principes qui guident nos actions au quotidien
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-[#000080] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-[#000080]">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600">
              Les passionnés derrière KaayJob
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-xl font-bold mb-2 text-[#000080]">{member.name}</h3>
                  <Badge className="mb-4 bg-[#FFF4EA] text-[#000080] hover:bg-[#FFF4EA]">
                    {member.role}
                  </Badge>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-[#000080] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez la communauté KaayJob
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Que vous soyez client ou prestataire, KaayJob est fait pour vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("categories")}
              className="bg-[#FFF4EA] hover:bg-white text-[#000080] font-bold px-8 py-3"
            >
              Trouver un service
            </Button>
            <Button
              onClick={() => onNavigate("register")}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#000080] px-8 py-3"
            >
              Devenir prestataire
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
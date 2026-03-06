import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Star, MapPin, Clock, Phone, MessageCircle, Award, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ServiceDetailPageProps {
  onNavigate: (page: string) => void;
}

export function ServiceDetailPage({ onNavigate }: ServiceDetailPageProps) {
  const provider = {
    name: "Ahmed Khan",
    title: "Plombier Expert",
    rating: 4.5,
    reviews: 120,
    yearsExperience: 8,
    image: "https://images.unsplash.com/photo-1604118600242-e7a6d23ec3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwbHVtYmVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU3NTk4Njc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyRate: 25,
    location: "Karachi, Pakistan",
    phone: "+92-300-1234567",
    specialties: ["Installation de Canalisations", "Réparation de Fuites", "Nettoyage de Drains", "Réparation de Chauffe-eau"],
    verified: true,
    responseTime: "Répond généralement dans les 2 heures"
  };

  const reviews = [
    {
      name: "Sarah Ahmed",
      rating: 5,
      date: "Il y a 2 jours",
      comment: "Excellent service ! Ahmed a rapidement réparé notre fuite de cuisine de manière professionnelle. Highly recommended!"
    },
    {
      name: "Mohammad Ali",
      rating: 4,
      date: "Il y a 1 semaine", 
      comment: "Bon travail sur la plomberie de la salle de bain. Arrivé à l'heure et a nettoyé après le travail."
    },
    {
      name: "Fatima Khan",
      rating: 5,
      date: "Il y a 2 semaines",
      comment: "Très compétent et honnête. Expliqué clairement le problème et a donné un prix juste."
    }
  ];

  const services = [
    { name: "Installation de Canalisations", price: "À partir de 30€" },
    { name: "Réparation de Fuites", price: "À partir de 25€" },
    { name: "Nettoyage de Drains", price: "À partir de 20€" },
    { name: "Réparation de Chauffe-eau", price: "À partir de 40€" },
    { name: "Service d'Urgence", price: "À partir de 50€" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <Card className="bg-white border-2 border-[#000080]/10 shadow-lg hover:border-[#000080]/30 transition-all animate-slide-up">
              <CardContent className="p-8 bg-gradient-to-br from-white to-[#FFF4EA]/30">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <ImageWithFallback
                    src={provider.image}
                    alt={provider.name}
                    className="w-32 h-32 rounded-xl object-cover border-4 border-[#000080]/20 shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-[#000080]">{provider.name}</h1>
                      {provider.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <p className="text-xl text-[#000080] font-semibold mb-3">{provider.title}</p>
                    
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(provider.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-lg font-semibold text-[#000080]">{provider.rating} ({provider.reviews} avis)</span>
                      </div>
                      <div className="flex items-center text-[#000080] font-semibold">
                        <Award className="w-5 h-5 mr-1" />
                        <span>{provider.yearsExperience} ans d'expérience</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-1" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-1" />
                        <span>{provider.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services & Pricing */}
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Services et Tarifs</h2>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center py-3">
                      <span className="text-lg">{service.name}</span>
                      <span className="font-semibold text-lg text-blue-600">{service.price}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg">Tarif Horaire</p>
                    <p className="text-2xl font-bold text-green-600">{provider.hourlyRate}€/h</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                    Réservation minimum 1 heure
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Spécialités</h2>
                <div className="flex flex-wrap gap-3">
                  {provider.specialties.map((specialty, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="text-base px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Avis Clients</h2>
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{review.name}</h3>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="bg-white border-0 shadow-md sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-green-600 mb-2">{provider.hourlyRate}/h</p>
                  <p className="text-gray-600">Tarif de départ</p>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
                    onClick={() => onNavigate('booking')}
                  >
                    Réserver Maintenant
                  </Button>
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 py-4 text-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Message
                  </Button>
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-4 text-lg"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Appeler {provider.phone}
                  </Button>
                </div>

                <Separator className="my-6" />
                
                <div className="text-center text-sm text-gray-600">
                  <p>✓ Vérifié par historique</p>
                  <p>✓ Assuré et garanti</p>
                  <p>✓ 100% garantie de satisfaction</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Informations de Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gray-500" />
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <span>{provider.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-gray-500" />
                    <span>{provider.responseTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

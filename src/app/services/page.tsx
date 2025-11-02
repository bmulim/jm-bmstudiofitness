"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Dumbbell,
  Heart,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  duration: string;
  capacity: string;
  icon: React.ReactNode;
  gradient: string;
  popular?: boolean;
}

const services: Service[] = [
  {
    id: "musculacao",
    title: "Musculação",
    description:
      "Treinamento personalizado com equipamentos de última geração para desenvolvimento muscular e força.",
    features: [
      "Avaliação física completa",
      "Treino personalizado",
      "Acompanhamento profissional",
      "Equipamentos modernos",
      "Flexibilidade de horários",
    ],
    price: "R$ 89,90",
    duration: "Ilimitado",
    capacity: "Individual",
    icon: <Dumbbell className="h-8 w-8" />,
    gradient: "from-[#FFD700] via-[#C2A537] to-[#B8941F]",
    popular: true,
  },
  {
    id: "personal",
    title: "Personal Training",
    description:
      "Acompanhamento individualizado com personal trainer especializado para resultados mais rápidos.",
    features: [
      "Instrutor exclusivo",
      "Plano nutricional básico",
      "Monitoramento de progresso",
      "Flexibilidade total",
      "Resultados garantidos",
    ],
    price: "R$ 180,00",
    duration: "1h por sessão",
    capacity: "1 pessoa",
    icon: <Target className="h-8 w-8" />,
    gradient: "from-[#C2A537] via-[#D4B547] to-[#E6C658]",
  },
  {
    id: "funcional",
    title: "Treino Funcional",
    description:
      "Exercícios funcionais que melhoram a performance em atividades do dia a dia.",
    features: [
      "Movimentos naturais",
      "Melhora da coordenação",
      "Fortalecimento do core",
      "Prevenção de lesões",
      "Grupos pequenos",
    ],
    price: "R$ 69,90",
    duration: "45 minutos",
    capacity: "Até 8 pessoas",
    icon: <Zap className="h-8 w-8" />,
    gradient: "from-[#B8941F] via-[#C2A537] to-[#D4B547]",
  },
  {
    id: "cardio",
    title: "Cardio & Conditioning",
    description:
      "Programa intensivo para melhorar o condicionamento cardiovascular e queimar gordura.",
    features: [
      "Exercícios aeróbicos",
      "Queima de gordura",
      "Melhora do fôlego",
      "Variedade de exercícios",
      "Monitoramento cardíaco",
    ],
    price: "R$ 59,90",
    duration: "30-45 minutos",
    capacity: "Até 12 pessoas",
    icon: <Heart className="h-8 w-8" />,
    gradient: "from-[#D4B547] via-[#FFD700] to-[#C2A537]",
  },
  {
    id: "grupo",
    title: "Aulas em Grupo",
    description:
      "Aulas dinâmicas e motivadoras em grupo com diversos tipos de exercícios.",
    features: [
      "Ambiente motivador",
      "Socialização",
      "Variedade de modalidades",
      "Instrutores qualificados",
      "Horários flexíveis",
    ],
    price: "R$ 49,90",
    duration: "50 minutos",
    capacity: "Até 15 pessoas",
    icon: <Users className="h-8 w-8" />,
    gradient: "from-[#E6C658] via-[#D4B547] to-[#C2A537]",
  },
  {
    id: "avaliacao",
    title: "Avaliação Física",
    description:
      "Análise completa da composição corporal e condicionamento físico para personalizar seu treino.",
    features: [
      "Bioimpedância",
      "Análise postural",
      "Testes de força",
      "Medidas corporais",
      "Relatório detalhado",
    ],
    price: "R$ 80,00",
    duration: "1 hora",
    capacity: "Individual",
    icon: <Calendar className="h-8 w-8" />,
    gradient: "from-[#C2A537] via-[#B8941F] to-[#FFD700]",
  },
];

export default function ServicesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#1b1b1a] via-black to-[#1b1b1a] text-white"
    >
      {/* Background decorativo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 text-center"
        >
          <h1 className="mb-6 bg-gradient-to-r from-[#FFD700] via-[#C2A537] to-[#B8941F] bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Nossos Serviços
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl">
            Descubra a variedade de serviços que oferecemos para transformar sua
            jornada fitness em uma experiência única e personalizada.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="relative"
              >
                {/* Popular Badge */}
                {service.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="absolute -top-3 right-4 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FFD700] to-[#C2A537] px-3 py-1 text-xs font-bold text-black"
                  >
                    <Star className="h-3 w-3 fill-current" />
                    Popular
                  </motion.div>
                )}

                {/* Background glow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.6 + index * 0.1,
                  }}
                  className="absolute -inset-4 animate-pulse rounded-3xl bg-gradient-to-r from-[#C2A537]/10 via-[#C2A537]/5 to-[#C2A537]/10 blur-xl"
                ></motion.div>

                <Card className="hover:shadow-3xl relative h-full border-2 border-[#C2A537]/30 bg-black/90 shadow-2xl shadow-[#C2A537]/10 backdrop-blur-lg transition-all duration-500 hover:border-[#C2A537]/50 hover:shadow-[#C2A537]/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`rounded-lg bg-gradient-to-r ${service.gradient} p-3 text-black`}
                      >
                        {service.icon}
                      </motion.div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#C2A537]">
                          {service.price}
                        </div>
                        <div className="text-xs text-slate-400">por mês</div>
                      </div>
                    </div>
                    <CardTitle className="bg-gradient-to-r from-[#FFD700] via-[#C2A537] to-[#B8941F] bg-clip-text text-xl font-bold text-transparent">
                      {service.title}
                    </CardTitle>
                    <p className="text-sm text-slate-300">
                      {service.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Service Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-4 w-4 text-[#C2A537]" />
                        {service.duration}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className="h-4 w-4 text-[#C2A537]" />
                        {service.capacity}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="mb-3 font-semibold text-[#C2A537]">
                        Benefícios Inclusos:
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 1 + index * 0.1 + featureIndex * 0.1,
                            }}
                            className="flex items-center gap-2 text-sm text-slate-300"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-[#C2A537]"></div>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full transform rounded-lg bg-gradient-to-r from-[#C2A537] to-[#D4B547] py-3 font-semibold text-black transition-all duration-300 hover:from-[#D4B547] hover:to-[#E6C658] hover:shadow-lg hover:shadow-[#C2A537]/30"
                    >
                      Escolher Plano
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-gradient-to-r from-[#C2A537]/10 via-transparent to-[#C2A537]/10 py-20"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-[#C2A537] md:text-4xl">
              Pronto para Começar?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
              Não perca mais tempo! Escolha o serviço ideal para você e comece
              sua transformação hoje mesmo.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-gradient-to-r from-[#FFD700] to-[#C2A537] px-8 py-4 text-lg font-bold text-black transition-all duration-300 hover:from-[#C2A537] hover:to-[#B8941F] hover:shadow-xl hover:shadow-[#C2A537]/40"
              >
                Fale Conosco
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

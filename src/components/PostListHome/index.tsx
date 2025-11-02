"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const posts = [
  {
    id: 1,
    title: "Dicas de Treino para Iniciantes",
    excerpt:
      "Começar na academia pode ser intimidador, mas com as dicas certas você consegue criar uma rotina eficaz e segura. Aprenda os fundamentos do treino.",
    category: "Treino",
    readTime: "5 min",
    image: "/banner-01.png",
  },
  {
    id: 2,
    title: "Alimentação Pré e Pós Treino",
    excerpt:
      "A nutrição adequada é fundamental para maximizar seus resultados. Descubra o que comer antes e depois dos exercícios para otimizar sua performance.",
    category: "Nutrição",
    readTime: "3 min",
    image: "/banner-02.png",
  },
  {
    id: 3,
    title: "Importância do Descanso",
    excerpt:
      "O descanso é tão importante quanto o treino. Entenda como o sono e os dias de recuperação impactam diretamente nos seus ganhos musculares.",
    category: "Recuperação",
    readTime: "4 min",
    image: "/banner-01.png",
  },
  {
    id: 4,
    title: "Exercícios para Fortalecimento do Core",
    excerpt:
      "Um core forte é a base de todos os movimentos. Conheça os melhores exercícios para desenvolver estabilidade e força no seu centro corporal.",
    category: "Treino",
    readTime: "6 min",
    image: "/banner-02.png",
  },
  {
    id: 5,
    title: "Hidratação Durante o Exercício",
    excerpt:
      "Manter-se hidratado é essencial para um bom desempenho. Aprenda quando e quanto beber água durante seus treinos para manter a performance.",
    category: "Saúde",
    readTime: "3 min",
    image: "/banner-01.png",
  },
  {
    id: 6,
    title: "Prevenção de Lesões na Academia",
    excerpt:
      "Treinar com segurança deve ser prioridade. Descubra as principais técnicas de aquecimento e prevenção para evitar lesões comuns na academia.",
    category: "Prevenção",
    readTime: "7 min",
    image: "/banner-02.png",
  },
];

export default function PostListHome() {
  // Variantes de animação para o container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Variantes de animação para cada card
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="relative w-full bg-black py-12 sm:py-16 md:py-20"
    >
      {/* Degradê dourado discreto */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-[#C2A537]/5 to-transparent"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Título da seção */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8 text-center sm:mb-12 md:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-3 text-3xl font-bold text-[#C2A537] sm:mb-4 sm:text-4xl"
          >
            Blog & Dicas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base text-gray-300 sm:text-lg"
          >
            Conteúdo exclusivo para maximizar seus resultados
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.02,
                y: -5,
                transition: { duration: 0.3 },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 },
              }}
              className="group"
            >
              <Card className="cursor-pointer border-gray-700 bg-black/50 backdrop-blur-sm transition-all duration-700 hover:border-[#C2A537] hover:shadow-xl hover:shadow-[#C2A537]/20">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="mb-2 flex items-center justify-between sm:mb-3">
                    <span className="rounded-full bg-[#C2A537]/20 px-2 py-1 text-xs font-medium text-[#C2A537] sm:px-3">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {post.readTime} de leitura
                    </span>
                  </div>

                  <div className="aspect-video overflow-hidden rounded-lg bg-gray-800">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <CardTitle className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#C2A537]">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="leading-relaxed text-gray-300">
                    {post.excerpt}
                  </CardDescription>

                  <div className="mt-4 flex items-center justify-between">
                    <button className="text-sm font-semibold text-[#C2A537] transition-colors duration-200 hover:text-[#D4B547]">
                      Ler mais →
                    </button>
                    <div className="flex space-x-1">
                      <div className="h-1 w-1 rounded-full bg-[#C2A537]"></div>
                      <div className="h-1 w-1 rounded-full bg-[#C2A537]/60"></div>
                      <div className="h-1 w-1 rounded-full bg-[#C2A537]/30"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 text-center sm:mt-10 md:mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-[#C2A537] px-6 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#D4B547] focus:ring-2 focus:ring-[#C2A537] focus:ring-offset-2 focus:ring-offset-black focus:outline-none sm:px-8 sm:py-3 sm:text-base"
          >
            Ver Todos os Posts
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}

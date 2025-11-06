"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the properties for the ProductHighlightCard component
interface ProductHighlightCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  > {
  categoryIcon: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const ProductHighlightCard = React.forwardRef<
  HTMLDivElement,
  ProductHighlightCardProps
>(
  (
    {
      className,
      categoryIcon,
      title,
      description,
      imageSrc,
      imageAlt,
      ...props
    },
    ref
  ) => {
    // --- Animation Logic for 3D Tilt Effect ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({
      clientX,
      clientY,
      currentTarget,
    }: React.MouseEvent) => {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    };

    // Transform mouse position into a rotation value
    const rotateX = useTransform(mouseY, [0, 350], [10, -10]);
    const rotateY = useTransform(mouseX, [0, 350], [-10, 10]);

    // Apply spring physics for a smoother animation
    const springConfig = { stiffness: 300, damping: 20 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    // --- Animation Logic for Glow Effect ---
    const glowX = useTransform(mouseX, [0, 350], [0, 100]);
    const glowY = useTransform(mouseY, [0, 350], [0, 100]);
    const glowOpacity = useTransform(mouseX, [0, 350], [0, 0.5]);

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative h-[350px] w-[350px] rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl border border-zinc-700/30 dark:border-zinc-800/50",
          "transition-[background-color,color,border-color] duration-800 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "bg-gradient-to-br from-amber-900/90 via-amber-800/80 to-amber-950 dark:from-amber-950 dark:via-amber-900 dark:to-amber-950",
          className
        )}
        {...props}
      >
        <div
          style={{
            transform: "translateZ(20px)",
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-4 rounded-xl bg-gradient-to-br from-zinc-50 via-white to-zinc-100/50 dark:from-zinc-900/80 dark:via-zinc-950 dark:to-black shadow-inner border border-zinc-200/30 dark:border-zinc-800/30"
        >
          {/* Diagonal line texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

          {/* Glow effect that follows the mouse */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0"
            style={{
              opacity: glowOpacity,
              background: `radial-gradient(80px at ${glowX}% ${glowY}%, hsl(var(--primary)), transparent 40%)`,
            }}
          />

          <div className="relative z-10 flex flex-col px-6 pt-6 pb-16">
            {/* Status Dot */}
            <div className="flex items-center">{categoryIcon}</div>

            {/* Product Image - After status badge */}
            {imageSrc && (
              <div className="relative mt-4 mb-2 w-full h-32 overflow-hidden rounded-lg">
                <motion.img
                  src={imageSrc}
                  alt={imageAlt}
                  style={{ transform: "translateZ(50px)" }}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* CORRECTED THIS LINE */}
            <div className="text-zinc-900 dark:text-zinc-50 transition-[color] duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] text-center mb-4">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProductHighlightCard.displayName = "ProductHighlightCard";

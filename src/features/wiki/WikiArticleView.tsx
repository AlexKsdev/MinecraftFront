export function WikiArticleView({ slug }: { slug: string }) {
  return (
    <section className="px-6 py-12">
      <h1 className="text-2xl font-semibold">Article: {slug}</h1>
    </section>
  );
}

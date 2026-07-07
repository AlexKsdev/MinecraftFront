export function BlogPostView({ slug }: { slug: string }) {
  return (
    <section className="px-6 py-12">
      <h1 className="text-2xl font-semibold">Post: {slug}</h1>
    </section>
  );
}

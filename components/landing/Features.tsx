import { PencilLine, Send, NotebookPen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-6 space-y-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function Features() {
  return (
    <section id="built-for-everyone" className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className="text-sm text-primary font-mono font-medium tracking-wider uppercase">BUILT FOR EVERYONE</h2>
          <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">Humanize any AI-generated text</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            icon={<PencilLine className="w-6 h-6 text-primary" />}
            title="Writers"
            description="Transform AI text and drafts into high quality writing, speeding up workflows and giving peace of mind knowing the content is original."
          />
          <FeatureCard
            icon={<Send className="w-6 h-6 text-primary" />}
            title="Marketers"
            description="Prevent being flagged as AI-generated, low quality, or spam when posting to social media platforms or sending marketing emails."
          />
          <FeatureCard
            icon={<NotebookPen className="w-6 h-6 text-primary" />}
            title="Bloggers"
            description="Enhance bland AI text into engaging and readable content that won't get flagged by Google as low quality AI-generated content."
          />
        </div>
      </div>
    </section>
  )
} 
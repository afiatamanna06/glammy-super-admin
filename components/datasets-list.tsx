"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Database, FileText } from "lucide-react";

interface Dataset {
  id: number;
  title: string;
  authors: string;
  year: string;
  source: string;
  url?: string;
  type: "paper" | "dataset";
  citation: string;
}

const DATASETS: Dataset[] = [
  {
    id: 1,
    title: "Retrieval-Augmented Generation for Large Language Models: A Survey",
    authors:
      "Gao, Y., Xiong, Y., Gao, X., Jia, K., Pan, J., Bi, Y., Dai, Y., Sun, J., Wang, M., Wang, H.",
    year: "2024",
    source: "arXiv:2312.10997",
    type: "paper",
    citation:
      "Gao, Y., et al. (2024). Retrieval-Augmented Generation for Large Language Models: A Survey. arXiv:2312.10997.",
  },
  {
    id: 2,
    title:
      "MuRAG: Multimodal Retrieval-Augmented Generator for Open Question Answering over Images and Text",
    authors: "Chen, W., Hu, H., Chen, X., Verga, P., Cohen, W.",
    year: "2022",
    source: "EMNLP 2022",
    url: "https://aclanthology.org/2022.emnlp-main.375.pdf",
    type: "paper",
    citation:
      "Chen, W., et al. (2022). MuRAG: Multimodal Retrieval-Augmented Generator for Open Question Answering over Images and Text. EMNLP 2022.",
  },
  {
    id: 3,
    title:
      "Ask in Any Modality: A Comprehensive Survey on Multimodal Retrieval-Augmented Generation",
    authors:
      "Abootorabi, M. M., Zobeiri, A., Dehghani, M., Mohammadkhani, M., Mohammadi, B., Ghahroodi, O., Soleymani Baghshah, M., Asgari, E.",
    year: "2023",
    source: "arXiv:2502.08826",
    type: "paper",
    citation:
      "Abootorabi, M. M., et al. (2023). Ask in Any Modality: A Comprehensive Survey on Multimodal Retrieval-Augmented Generation. arXiv:2502.08826.",
  },
  {
    id: 4,
    title:
      "HM-RAG: Hierarchical Multi-Agent Multimodal Retrieval-Augmented Generation",
    authors: "Liu, P., Liu, X., Yao, R., Liu, J., Meng, S., Wang, D., Ma, J.",
    year: "2025",
    source: "arXiv:2504.12330",
    type: "paper",
    citation:
      "Liu, P., et al. (2025). HM-RAG: Hierarchical Multi-Agent Multimodal Retrieval-Augmented Generation. arXiv:2504.12330.",
  },
  {
    id: 5,
    title:
      "VOGUE: A Multimodal Dataset for Conversational Recommendation in Fashion",
    authors: "Guo, D., Sun, M., Jiang, Y., Liang, J.",
    year: "2023",
    source: "arXiv:2303.12345",
    type: "paper",
    citation:
      "Guo, D., et al. (2023). VOGUE: A Multimodal Dataset for Conversational Recommendation in Fashion. arXiv:2303.12345.",
  },
  {
    id: 6,
    title:
      "Multi-modal Clothing Recommendation Model Based on Large Model and VAE Enhancement",
    authors: "Huang, B., Lu, Q., Huang, S., Wang, X., Yang, H.",
    year: "2024",
    source: "arXiv:2410.02219",
    type: "paper",
    citation:
      "Huang, B., et al. (2024). Multi-modal Clothing Recommendation Model Based on Large Model and VAE Enhancement. arXiv:2410.02219.",
  },
  {
    id: 7,
    title:
      "Clothing Recommendation with Multimodal Feature Fusion: Price Sensitivity and Personalization Optimization",
    authors: "Zhang, C., Ji, X.",
    year: "2023",
    source: "Applied Sciences, 15(8), 4591",
    type: "paper",
    citation:
      "Zhang, C., Ji, X. (2023). Clothing Recommendation with Multimodal Feature Fusion: Price Sensitivity and Personalization Optimization. Applied Sciences, 15(8), 4591.",
  },
  {
    id: 8,
    title:
      "Multi-RAG: A Multimodal Retrieval-Augmented Generation System for Adaptive Video Understanding",
    authors:
      "Mao, M., Perez-Cabarcas, M. M., Kallakuri, U., Waytowich, N. R., Lin, X., Mohsenin, T.",
    year: "2023",
    source: "arXiv:2505.23990",
    type: "paper",
    citation:
      "Mao, M., et al. (2023). Multi-RAG: A Multimodal Retrieval-Augmented Generation System for Adaptive Video Understanding. arXiv:2505.23990.",
  },
  {
    id: 9,
    title: "Fashion Product Images (Small)",
    authors: "Kaggle Dataset",
    year: "2023",
    source: "Kaggle",
    url: "https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-small",
    type: "dataset",
    citation: "Kaggle Dataset: Fashion Product Images (Small).",
  },
  {
    id: 10,
    title: "VOGUE Fashion Recommendation Dataset",
    authors: "Guo, D., et al.",
    year: "2025",
    source: "arXiv:2510.21151",
    url: "https://arxiv.org/abs/2510.21151",
    type: "dataset",
    citation: "VOGUE Fashion Recommendation Dataset. arXiv:2510.21151",
  },
];

export default function DatasetsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Datasets & References
          </h2>
          <p className="text-muted-foreground mt-2">
            Academic papers and datasets used for model training and validation
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {DATASETS.map((item) => (
          <Card key={item.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.type === "dataset" ? "secondary" : "outline"
                      }
                    >
                      {item.type === "dataset" ? (
                        <Database className="w-3 h-3 mr-1" />
                      ) : (
                        <FileText className="w-3 h-3 mr-1" />
                      )}
                      {item.type === "dataset" ? "Dataset" : "Paper"}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">
                      {item.year}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {item.source}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold leading-none tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {item.authors}
                  </p>

                  <div className="pt-2 text-xs font-mono text-muted-foreground bg-muted/30 p-2 rounded w-fit">
                    {item.citation}
                  </div>
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

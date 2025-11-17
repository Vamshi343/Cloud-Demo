// server/tools/mockGemini.mjs

async function chat(userMessage) {
  const msg = userMessage.toLowerCase();

  // ============================================
  // TERRAFORM QUESTIONS
  // ============================================
  if (msg.includes("terraform") || msg.includes("iac") || msg.includes("infrastructure as code")) {
    return `**Terraform** is an Infrastructure as Code (IaC) tool for provisioning GCP resources.

📝 **How It Works**:
1. Write configuration files (.tf)
2. Define desired infrastructure state
3. Run \`terraform apply\`
4. Terraform creates/updates resources

**Example - Creating a GCP Bucket**:
\`\`\`hcl
resource "google_storage_bucket" "demo" {
  name          = "my-unique-bucket"
  location      = "US"
  storage_class = "STANDARD"
  
  versioning {
    enabled = true
  }
}
\`\`\`

✅ **Benefits**:
- Version control your infrastructure
- Reproducible environments
- Collaborative workflows
- Multi-cloud support (GCP, AWS, Azure)
- State tracking (knows current vs desired)

🔄 **Common Commands**:
- \`terraform init\` - Initialize
- \`terraform plan\` - Preview changes
- \`terraform apply\` - Apply changes
- \`terraform destroy\` - Delete resources`;
  }

  // ============================================
  // BIGQUERY QUESTIONS
  // ============================================
  if (msg.includes("bigquery") || msg.includes("data warehouse")) {
    return `**BigQuery** is Google's serverless, highly scalable enterprise data warehouse.

⚡ **Key Features**:
- **Serverless**: No infrastructure management
- **Lightning Fast**: Analyze petabytes in seconds
- **SQL Interface**: Standard SQL queries (ANSI SQL 2011)
- **Real-time Analysis**: Stream data for instant insights
- **Built-in ML**: BQML for machine learning on data

💡 **How It Works**:
1. Store data in tables/datasets
2. Query using standard SQL
3. Pay only for queries you run
4. Integrate with Looker, Data Studio, Jupyter

💸 **Pricing**:
- Storage: $0.02/GB/month
- Queries: $5/TB scanned
- Free tier: 1TB queries/month

🎯 **Perfect For**: Business intelligence, dashboards, data analytics, ML training data`;
  }

  // ============================================
  // CLOUD STORAGE QUESTIONS
  // ============================================
  if (msg.includes("cloud storage") || msg.includes("bucket") || msg.includes("object storage") || msg.includes("storage class")) {
    return `**Google Cloud Storage** is object storage for companies of all sizes.

📦 **Storage Classes**:
- **Standard**: Frequent access, highest availability
- **Nearline**: Access ~once/month, 30-day minimum
- **Coldline**: Access ~once/quarter, 90-day minimum
- **Archive**: Access ~once/year, 365-day minimum

🔒 **Security Features**:
- Encryption at rest (default)
- Encryption in transit (HTTPS/TLS)
- IAM & ACLs for access control
- Object versioning
- Retention policies

💰 **Pricing**: Pay only for what you store and transfer
📍 **Locations**: Single-region, dual-region, multi-region
🔗 **Use Cases**: Backups, data lakes, content delivery, big data analytics`;
  }

  // ============================================
  // GCP GENERAL / OVERVIEW
  // ============================================
  if (msg.includes("what is gcp") || msg.includes("google cloud") || (msg.includes("gcp") && (msg.includes("about") || msg.includes("what") || msg.includes("explain")))) {
    return `**Google Cloud Platform (GCP)** is a suite of cloud computing services that includes:

🔹 **Compute**: Virtual machines (Compute Engine), containers (GKE), serverless (Cloud Functions, Cloud Run)
🔹 **Storage**: Cloud Storage, Persistent Disks, Filestore
🔹 **Databases**: Cloud SQL, Firestore, BigQuery, Spanner
🔹 **AI/ML**: Gemini AI, Vertex AI, AutoML, Vision AI, Speech-to-Text
🔹 **Networking**: VPC, Load Balancers, Cloud CDN, Cloud DNS
🔹 **DevOps**: Cloud Build, Artifact Registry, Cloud Deploy

**Why choose GCP?**
- Google's global infrastructure (fastest network)
- Best-in-class data analytics (BigQuery)
- Leading AI/ML capabilities
- Strong open-source ecosystem (Kubernetes, TensorFlow)`;
  }

  // ============================================
  // PRICING QUESTIONS
  // ============================================
  if (msg.includes("pricing") || msg.includes("cost") || msg.includes("free tier") || msg.includes("how much") || msg.includes("price")) {
    return `**GCP Pricing & Free Tier**:

🆓 **Always Free (Every Month)**:
- Cloud Storage: 5 GB
- BigQuery: 1 TB queries, 10 GB storage
- Compute Engine: 1 f1-micro instance
- Cloud Functions: 2M invocations
- Cloud Build: 120 build-minutes/day

💳 **Free Trial**:
- $300 credit for 90 days
- Access to all GCP services
- No automatic charges after trial ends

💰 **Cost Optimization Tips**:
1. **Sustained Use Discounts**: Automatic (up to 30% off)
2. **Committed Use Contracts**: Save up to 57%
3. **Preemptible VMs**: 80% cheaper (but can be terminated)
4. **Cloud Storage Classes**: Use Nearline/Coldline for infrequent access
5. **BigQuery**: Partition tables, use clustering

📊 **Pricing Calculator**: cloud.google.com/products/calculator`;
  }

  // ============================================
  // COMPARISON QUESTIONS (GCP vs AWS/Azure)
  // ============================================
  if (msg.includes("vs") || msg.includes("versus") || msg.includes("compare") || msg.includes("difference between")) {
    if (msg.includes("aws") || msg.includes("amazon") || msg.includes("azure") || msg.includes("microsoft")) {
      return `**GCP vs AWS vs Azure** - Quick Comparison:

🔵 **GCP Strengths**:
- Best for: Data analytics (BigQuery), ML/AI (Vertex AI), Kubernetes (GKE)
- Pricing: Most transparent, per-second billing, sustained use discounts
- Network: Google's global fiber network (fastest)
- Innovation: Latest tech (Kubernetes, TensorFlow born here)

🟠 **AWS Strengths**:
- Most services (200+ services)
- Largest market share (~32%)
- Most mature ecosystem
- Best for: Enterprise apps, general purpose

🔷 **Azure Strengths**:
- Best for: Microsoft shops (Office 365, Windows Server)
- Hybrid cloud leader (Azure Arc)
- Active Directory integration
- Best for: .NET applications, enterprise integration

**Choose GCP if**: You need cutting-edge data analytics, ML capabilities, or Kubernetes expertise.`;
    }
  }

  // ============================================
  // SECURITY & IAM
  // ============================================
  if (msg.includes("security") || msg.includes("iam") || msg.includes("authentication") || msg.includes("permission") || msg.includes("access control")) {
    return `**GCP Security & IAM Best Practices**:

🔐 **IAM (Identity & Access Management)**:
- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Service Accounts**: For applications (not humans)
- **Roles**: Predefined (Owner, Editor, Viewer) or Custom
- **Example**: Give BigQuery read-only access, not full project owner

🛡️ **Data Protection**:
- **Encryption at Rest**: Default for all services
- **Encryption in Transit**: TLS/HTTPS everywhere
- **Customer-Managed Keys (CMEK)**: Control your own encryption keys
- **VPC Service Controls**: Create security perimeters

🔍 **Monitoring & Compliance**:
- **Cloud Audit Logs**: Track all actions
- **Security Command Center**: Unified security dashboard
- **Cloud Armor**: DDoS protection, WAF
- **Compliance**: GDPR, HIPAA, SOC 2, ISO 27001, PCI DSS

**Pro Tip**: Never use personal accounts for services - always use service accounts with scoped permissions!`;
  }

  // ============================================
  // KUBERNETES / GKE
  // ============================================
  if (msg.includes("kubernetes") || msg.includes("gke") || msg.includes("k8s") || msg.includes("container")) {
    return `**Google Kubernetes Engine (GKE)**:

🚢 **What is GKE?**
Managed Kubernetes service - deploy, manage, and scale containerized applications.

✨ **Key Features**:
- **Autopilot Mode**: Fully managed, hands-off Kubernetes
- **Standard Mode**: More control over nodes
- **Auto-scaling**: Pods and nodes scale automatically
- **Built-in Security**: Binary Authorization, Workload Identity
- **CI/CD Integration**: Works with Cloud Build, GitLab, Jenkins

**Why GKE over DIY Kubernetes?**
✅ Google manages control plane (free!)
✅ Auto-upgrades and patching
✅ Integrated logging/monitoring
✅ Best practices by default
✅ Enterprise support

**Use Cases**: Microservices, batch processing, ML workloads, hybrid/multi-cloud`;
  }

  // ============================================
  // MACHINE LEARNING / AI
  // ============================================
  if (msg.includes("machine learning") || msg.includes("ml") || msg.includes("vertex ai") || msg.includes("automl") || (msg.includes("ai") && !msg.includes("gemini"))) {
    return `**GCP AI/ML Services**:

🤖 **Vertex AI** (Unified ML Platform):
- Train custom models
- Deploy models at scale
- AutoML for no-code ML
- Feature Store for ML features
- MLOps tools (experiments, pipelines)

🎯 **Pre-trained APIs**:
- **Vision AI**: Image recognition, OCR
- **Speech-to-Text**: Transcribe audio
- **Natural Language API**: Sentiment analysis, entity extraction
- **Translation API**: 100+ languages
- **Video Intelligence**: Analyze videos

**BigQuery ML (BQML)**:
- Train ML models using SQL
- No need to export data
- Built-in algorithms: Linear regression, classification, clustering

**Use Cases**: Recommendation systems, fraud detection, predictive analytics, chatbots, image classification`;
  }

  // ============================================
  // GEMINI-SPECIFIC
  // ============================================
  if (msg.includes("gemini")) {
    return `**Gemini** is Google's most capable AI model family:

🧠 **Multimodal**: Understands text, images, audio, video
🚀 **Ultra, Pro, Nano**: Different sizes for different needs
💼 **Enterprise**: Available via Vertex AI
🔌 **API Access**: Easy integration with apps
🎯 **Grounded**: Can search and cite sources

Available in GCP through Vertex AI API and AI Studio.`;
  }

  // ============================================
  // NETWORKING
  // ============================================
  if (msg.includes("network") || msg.includes("vpc") || msg.includes("load balancer") || msg.includes("cdn")) {
    return `**GCP Networking**:

🌐 **VPC (Virtual Private Cloud)**:
- Isolated network for your resources
- Subnets, firewall rules, routes
- Global by default (spans regions)
- Private Google Access (reach GCP services privately)

⚖️ **Load Balancing**:
- **HTTP(S) Load Balancer**: Global, layer 7
- **Network Load Balancer**: Regional, layer 4
- **Internal Load Balancer**: Private traffic
- Auto-scaling backends

🚀 **Cloud CDN**:
- Cache content at Google edge locations
- Reduce latency globally
- Integrated with Cloud Storage, Compute Engine

🔒 **Cloud VPN & Interconnect**:
- VPN: Connect on-prem to GCP
- Dedicated Interconnect: Physical connection (10-200 Gbps)
- Partner Interconnect: Via service provider

**Google's Network**: Largest private network in the world!`;
  }

  // ============================================
  // SERVERLESS
  // ============================================
  if (msg.includes("serverless") || msg.includes("cloud function") || msg.includes("cloud run")) {
    return `**GCP Serverless Options**:

⚡ **Cloud Functions**:
- Event-driven functions
- Trigger: HTTP, Pub/Sub, Storage events
- Languages: Node.js, Python, Go, Java
- Use case: Webhooks, data processing, IoT

🏃 **Cloud Run**:
- Containerized apps, fully managed
- Scale to zero (pay only when running)
- Deploy any containerized app
- Use case: APIs, web apps, microservices

🔄 **Comparison**:
| Feature | Cloud Functions | Cloud Run |
|---------|----------------|-----------|
| **Runtime** | Functions only | Any container |
| **Trigger** | Events + HTTP | HTTP only |
| **Max Timeout** | 9 minutes | 60 minutes |
| **Best For** | Simple tasks | Full apps |

**Benefits**: No servers to manage, auto-scaling, pay per use!`;
  }

  // ============================================
  // DEFAULT / HELPFUL RESPONSE
  // ============================================
  return `I'm a GCP Smart Agent. I can answer questions about:

💬 **Topics I know**:
- **Terraform** - Infrastructure as Code
- **BigQuery** - Data warehouse & analytics
- **Cloud Storage** - Object storage & buckets
- **GCP Overview** - Services & features
- **Pricing** - Costs & free tier
- **Security & IAM** - Access control
- **GKE/Kubernetes** - Container orchestration
- **AI/ML** - Vertex AI, machine learning
- **Networking** - VPC, load balancers
- **Serverless** - Cloud Functions, Cloud Run
- **Comparisons** - GCP vs AWS/Azure

**Try asking naturally**:
- "What is Terraform?"
- "Explain BigQuery"
- "Tell me about GCP pricing"
- "How does Cloud Storage work?"
- "GCP vs AWS"

**Or use commands to manage resources**:
- "list buckets"
- "query bigquery"
- "bucket details vamshi-demo-bucket"`;
}

export default {
  chat
};
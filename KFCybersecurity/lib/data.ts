import { Service, ActiveDeployments } from '@/types';

export const services: Service[] = [
  { id: 1, name: "Asset Mapper 360", vertical: "Identify", desc: "Automated network discovery & inventory.", price: "$5/device" },
  { id: 2, name: "VulnScan Pro", vertical: "Identify", desc: "Continuous vulnerability assessment.", price: "$150/mo" },
  { id: 3, name: "Sentinel Endpoint", vertical: "Protect", desc: "NGAV & Ransomware rollback.", price: "$8/user" },
  { id: 4, name: "ZeroTrust Gateway", vertical: "Protect", desc: "DNS filtering & ZTNA access.", price: "$6/user" },
  { id: 5, name: "EagleEye SIEM", vertical: "Detect", desc: "24/7 Log aggregation & correlation.", price: "$500/mo" },
  { id: 6, name: "RapidResponse SOAR", vertical: "Respond", desc: "Automated incident isolation scripts.", price: "$200/mo" },
  { id: 7, name: "CloudVault BDR", vertical: "Recover", desc: "Immutable cloud backups.", price: "$0.10/GB" },
  { id: 8, name: "PhishSim Trainer", vertical: "Govern", desc: "Employee awareness training.", price: "$2/user" }
];

export const defaultDeployments: ActiveDeployments = {
  "Acme Corp": [1, 3, 5, 7],
  "Globex Inc": [3, 4],
  "Soylent Corp": [1, 2, 3, 4, 5, 6, 7, 8]
};

export const clients = ["Acme Corp", "Globex Inc", "Soylent Corp"];

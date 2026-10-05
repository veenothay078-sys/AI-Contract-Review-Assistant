import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'database.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], contracts: [], versions: [] }, null, 2));
}

function readDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    if (!parsed.users) parsed.users = [];
    return parsed;
  } catch (error) {
    console.error("Error reading database:", error);
    return { contracts: [], versions: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export const db = {
  createUser: (name, email, passwordHash, company = '') => {
    const data = readDB();
    const newUser = {
      id: generateId('U'),
      name,
      email,
      passwordHash,
      company,
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    writeDB(data);
    return newUser;
  },

  getUserByEmail: (email) => {
    const data = readDB();
    return data.users.find(u => u.email === email) || null;
  },

  getUserById: (id) => {
    const data = readDB();
    return data.users.find(u => u.id === id) || null;
  },

  getAllContracts: (userId) => {
    const data = readDB();
    return data.contracts
      .filter(c => c.userId === userId || (!c.userId)) // Keep old contracts visible if no userId for backward compatibility
      .map(c => {
      // populate versions array minimally
      const versions = data.versions
        .filter(v => v.contractId === c.id)
        .sort((a, b) => b.versionNumber - a.versionNumber)
        .map(v => ({
          id: v.id,
          versionNumber: v.versionNumber,
          fileName: v.fileName,
          uploadedAt: v.uploadedAt,
          riskScore: v.riskScore,
          riskLevel: v.riskLevel
        }));
      return { ...c, versions };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getContractById: (contractId, userId) => {
    const data = readDB();
    const contract = data.contracts.find(c => c.id === contractId && (c.userId === userId || !c.userId));
    if (!contract) return null;
    
    const versions = data.versions
      .filter(v => v.contractId === contractId)
      .sort((a, b) => b.versionNumber - a.versionNumber)
      .map(v => ({
        id: v.id,
        versionNumber: v.versionNumber,
        fileName: v.fileName,
        uploadedAt: v.uploadedAt,
        riskScore: v.riskScore,
        riskLevel: v.riskLevel
      }));
      
    return { ...contract, versions };
  },

  getVersionById: (versionId, userId) => {
    const data = readDB();
    const version = data.versions.find(v => v.id === versionId) || null;
    if (!version) return null;
    
    // Verify user owns the contract
    const contract = data.contracts.find(c => c.id === version.contractId);
    if (!contract || (contract.userId && contract.userId !== userId)) return null;
    
    return version;
  },

  createContract: (title, contractType, userId) => {
    const data = readDB();
    const newContract = {
      id: generateId('C'),
      userId,
      title: title || 'Untitled Contract',
      contractType: contractType || 'UNKNOWN',
      createdAt: new Date().toISOString(),
      currentVersionId: null,
      latestVersionNumber: 0
    };
    data.contracts.push(newContract);
    writeDB(data);
    return newContract;
  },

  addVersion: (contractId, fileName, analysisData, userId) => {
    const data = readDB();
    const contract = data.contracts.find(c => c.id === contractId && (c.userId === userId || !c.userId));
    if (!contract) throw new Error("Contract not found or access denied");

    const newVersionNumber = contract.latestVersionNumber + 1;
    const newVersion = {
      id: generateId('V'),
      contractId: contract.id,
      versionNumber: newVersionNumber,
      fileName: fileName,
      uploadedAt: new Date().toISOString(),
      analysisData: analysisData,
      riskScore: analysisData.riskScore || 0,
      riskLevel: analysisData.riskLevel || 'Unknown'
    };

    data.versions.push(newVersion);
    contract.latestVersionNumber = newVersionNumber;
    contract.currentVersionId = newVersion.id;
    
    writeDB(data);
    return newVersion;
  }
};

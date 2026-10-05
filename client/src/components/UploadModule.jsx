import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Trash2, Sparkles, FileType, RefreshCw } from 'lucide-react';

export default function UploadModule({ onAnalysisComplete, onShowNotification, existingContractId = null, existingContractTitle = null }) {
  const [file, setFile] = useState(null);
  const [rawFile, setRawFile] = useState(null); // the actual File object
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState("Preparing file...");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Simulates a brief visual upload progress before marking file as ready
  const simulateFileStaging = (selectedFile) => {
    if (!selectedFile) return;

    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    if (fileExt !== 'pdf') {
      onShowNotification("Invalid file type. Only PDF documents are supported.", "error");
      return;
    }
    if (selectedFile.size > 15 * 1024 * 1024) {
      onShowNotification("File exceeds 15MB limit. Please upload a smaller document.", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("Staging document for analysis...");

    const steps = [
      { at: 20, msg: "Validating file checksums..." },
      { at: 50, msg: "Preparing text extraction pipeline..." },
      { at: 80, msg: "Readying AI review pipeline..." },
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      steps.forEach(s => { 
        if (progress === s.at) setUploadStatus(s.msg); 
      });
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        // Store actual File object so we can send it to the backend
        setRawFile(selectedFile);
        setFile({
          name: selectedFile.name,
          size: `${(selectedFile.size / 1024).toFixed(1)} KB`,
          type: fileExt.toUpperCase(),
          uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        onShowNotification("File uploaded successfully! Ready for AI analysis.");
      }
    }, 150);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileStaging(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileStaging(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setRawFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onShowNotification("File removed.");
  };

  const triggerAnalysis = () => {
    if (!file || !rawFile) return;
    // Pass the real File object and existingContractId to App for backend analysis
    onAnalysisComplete(rawFile, existingContractId);
  };

  return (
    <div id="upload-section" className="max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-xl border border-border shadow-sm p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-textPrimary flex items-center gap-2">
              <FileType className="w-6 h-6 text-accent" />
              <span>{existingContractId ? `Upload New Version` : `Contract Source File`}</span>
            </h2>
            <p className="text-sm text-textMuted mt-1">
              {existingContractId 
                ? `Upload a new revision for: ${existingContractTitle}` 
                : `Upload any legal PDF (NDA, employment, rental, service agreement, etc.) for AI analysis.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-textMuted font-medium px-3 py-1.5 bg-background border border-border rounded-lg">
              PDF Only · Max 15MB
            </span>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <AnimatePresence mode="wait">
          {!file && !isUploading && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] ${
                dragActive 
                  ? "border-accent bg-accent/10 scale-[1.02]" 
                  : "border-border hover:border-accent hover:bg-accent/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <motion.div 
                animate={dragActive ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }}
                className="p-4 bg-background border border-border text-accent rounded-full mb-4 shadow-sm"
              >
                <Upload className="w-6 h-6" />
              </motion.div>
              <h3 className="text-base font-semibold text-textPrimary">
                Click or drag document to upload
              </h3>
              <p className="text-xs sm:text-sm text-textMuted mt-2 max-w-sm">
                Supports any legal PDF document — NDA, employment, rental, service agreement, and more
              </p>
              <button
                type="button"
                className="mt-6 px-5 py-2.5 bg-card hover:bg-border text-textSecondary font-semibold rounded-xl text-sm transition-all duration-200 shadow-sm border border-border active:scale-95"
              >
                Browse Files
              </button>
            </motion.div>
          )}

          {/* Upload Progress Animation */}
          {isUploading && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-border rounded-premium p-8 sm:p-12 text-center min-h-[260px] flex flex-col items-center justify-center bg-card/30"
            >
              <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-accent animate-spin" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-textPrimary">Staging Document...</h3>
              <p className="text-xs text-accent font-medium mt-1 animate-pulse">{uploadStatus}</p>
              <div className="w-full max-w-xs bg-border h-2 rounded-full mt-6 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-accent to-accentSecondary h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-xs font-bold text-accent mt-2">{uploadProgress}%</span>
            </motion.div>
          )}

          {/* Upload Complete / File Details */}
          {file && !isUploading && (
            <motion.div
              key="uploaded-file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="border border-border bg-card rounded-premium p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-elevated text-accent rounded-2xl shadow-sm flex-shrink-0">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-textPrimary text-base sm:text-lg break-all max-w-[280px] sm:max-w-md">
                      {file.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-textMuted">
                      <span>Size: {file.size}</span>
                      <span>•</span>
                      <span>Uploaded: {file.uploadTime}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-success/20 text-success font-semibold border border-success/30">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={handleRemoveFile}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-card border border-border hover:bg-elevated text-danger font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 hover:border-danger/50 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                  <button
                    onClick={triggerAnalysis}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-accent to-accentSecondary text-secondaryBg font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-accent/10 hover:shadow-lg active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-secondaryBg animate-pulse" />
                    <span>Analyze Contract</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

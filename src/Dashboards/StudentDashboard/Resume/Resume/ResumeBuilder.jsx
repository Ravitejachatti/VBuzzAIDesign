import React, { useState, useEffect, useRef } from "react";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { 
  FileText, 
  Download, 
  Eye, 
  Palette, 
  Settings, 
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import ResumeTemplate1 from "../Template/ResumeTemplate1";
import ResumeTemplate2 from "../Template/ResumeTemplate2";

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const pdfRef = useRef(null);

  const student = localStorage.getItem("studentData");
  console.log("Student Data in localStorage:", student);

  const templates = {
    template1: <ResumeTemplate1 />,
    template2: <ResumeTemplate2 />,
  };

  const templateInfo = {
    template1: {
      name: "Professional Classic",
      description: "Clean, professional design perfect for corporate roles",
      features: ["ATS-Friendly", "Clean Layout", "Professional"],
      color: "from-blue-500 to-blue-600",
      preview: "/api/placeholder/300/400"
    },
    template2: {
      name: "Modern Executive",
      description: "Contemporary design with excellent visual hierarchy",
      features: ["Modern Design", "Visual Appeal", "Executive"],
      color: "from-purple-500 to-purple-600",
      preview: "/api/placeholder/300/400"
    }
  };

  useEffect(() => {
    const generatePreview = async () => {
      setIsGenerating(true);
      try {
        const blob = await pdf(templates[selectedTemplate]).toBlob();
        setPreviewUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error generating preview:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    generatePreview();
  }, [selectedTemplate]);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(templates[selectedTemplate]).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-${selectedTemplate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              Professional Resume Builder
            </h2>
            <p className="text-gray-600 mt-2">Create stunning, ATS-friendly resumes in minutes</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">ATS-Optimized</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Instant Generation</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Professional Templates</span>
              </div>
            </div>
            <div className="flex items-center text-blue-600">
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <h3 className="text-xl font-bold flex items-center">
                <Palette className="w-6 h-6 mr-3" />
                Choose Template
              </h3>
              <p className="text-blue-100 mt-1">Select a professional design</p>
            </div>

            <div className="p-6 space-y-4">
              {Object.entries(templateInfo).map(([key, info]) => (
                <div
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                    selectedTemplate === key
                      ? 'border-blue-500 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{info.name}</h4>
                      {selectedTemplate === key && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{info.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {info.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedTemplate === key && (
                    <div className={`h-1 bg-gradient-to-r ${info.color}`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Template Stats */}
            <div className="border-t border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-xs text-gray-500">Templates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs text-gray-500">ATS Compatible</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-bold text-yellow-900 mb-3 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Pro Tips
            </h4>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start">
                <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Keep your resume to 1-2 pages maximum
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Use action verbs to describe achievements
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Quantify your accomplishments with numbers
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Tailor your resume for each job application
              </li>
            </ul>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2">
          {showPreview && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Live Preview - {templateInfo[selectedTemplate].name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="relative">
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      <p className="text-gray-600 font-medium">Generating your resume...</p>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <PDFViewer 
                    style={{ 
                      width: "100%", 
                      height: "800px", 
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px"
                    }}
                  >
                    {templates[selectedTemplate]}
                  </PDFViewer>
                </div>
              </div>
            </div>
          )}

          {!showPreview && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Preview Hidden</h3>
              <p className="text-gray-600 mb-6">Click "Show Preview" to see your resume</p>
              <button
                onClick={() => setShowPreview(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Show Preview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Download Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to Download?</h3>
            <p className="text-blue-100">Your professional resume is ready for download in PDF format.</p>
          </div>
          <div className="flex items-center space-x-4">
            <PDFDownloadLink
              document={templates[selectedTemplate]}
              fileName={`resume-${selectedTemplate}.pdf`}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {({ loading }) => (
                <>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      Preparing PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-3" />
                      Download Resume PDF
                    </>
                  )}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
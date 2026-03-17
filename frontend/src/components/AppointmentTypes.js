import React from 'react';
import { Activity, Droplet, Heart, Syringe, Bandage, Pill } from 'lucide-react';

export const APPOINTMENT_TYPES_INFO = {
  'New Consultation': {
    icon: Activity,
    english: 'New Consultation',
    bengali: 'নতুন পরামর্শ',
    description: 'First-time visit for diagnosis and treatment plan',
    bengaliDesc: 'প্রথমবার রোগ নির্ণয় এবং চিকিৎসা পরিকল্পনার জন্য',
    features: [
      'Complete health assessment / সম্পূর্ণ স্বাস্থ্য মূল্যায়ন',
      'Medical history review / চিকিৎসা ইতিহাস পর্যালোচনা',
      'Treatment recommendations / চিকিৎসা সুপারিশ'
    ]
  },
  'Blood Test': {
    icon: Droplet,
    english: 'Blood Test',
    bengali: 'রক্ত পরীক্ষা',
    description: 'Laboratory blood analysis for various health parameters',
    bengaliDesc: 'বিভিন্ন স্বাস্থ্য পরামিতির জন্য রক্ত বিশ্লেষণ',
    features: [
      'Complete Blood Count (CBC) / সম্পূর্ণ রক্ত গণনা',
      'Blood Sugar / রক্তে শর্করা',
      'Lipid Profile / লিপিড প্রোফাইল',
      'Liver & Kidney Function / লিভার ও কিডনি কার্যকারিতা',
      'Thyroid Test / থাইরয়েড পরীক্ষা'
    ]
  },
  'ECG': {
    icon: Heart,
    english: 'ECG (Electrocardiogram)',
    bengali: 'ইসিজি (হৃদযন্ত্র পরীক্ষা)',
    description: 'Heart activity recording to check cardiac health',
    bengaliDesc: 'হৃদযন্ত্রের স্বাস্থ্য পরীক্ষার জন্য কার্যকলাপ রেকর্ডিং',
    features: [
      'Heart rhythm analysis / হৃদস্পন্দন বিশ্লেষণ',
      'Cardiac abnormality detection / হৃদরোগ সনাক্তকরণ',
      'Quick 5-10 minute test / দ্রুত ৫-১০ মিনিটের পরীক্ষা',
      'Non-invasive procedure / ব্যথাহীন পদ্ধতি'
    ]
  },
  'X-Ray': {
    icon: Activity,
    english: 'X-Ray',
    bengali: 'এক্স-রে',
    description: 'Radiographic imaging for bones, chest, and internal organs',
    bengaliDesc: 'হাড়, বুক এবং অভ্যন্তরীণ অঙ্গের ছবি',
    features: [
      'Chest X-Ray / বুকের এক্স-রে',
      'Bone & Joint X-Ray / হাড় ও জয়েন্টের এক্স-রে',
      'Abdomen X-Ray / পেটের এক্স-রে',
      'Digital imaging / ডিজিটাল ইমেজিং',
      'Immediate results / তাৎক্ষণিক ফলাফল'
    ]
  },
  'Injection': {
    icon: Syringe,
    english: 'Injection',
    bengali: 'ইনজেকশন',
    description: 'Administration of prescribed medications via injection',
    bengaliDesc: 'ইনজেকশনের মাধ্যমে নির্ধারিত ওষুধ প্রদান',
    features: [
      'IM/IV injections / পেশী/শিরায় ইনজেকশন',
      'Vitamin B12 / ভিটামিন বি১২',
      'Pain relief injections / ব্যথা উপশম ইনজেকশন',
      'Antibiotic injections / অ্যান্টিবায়োটিক ইনজেকশন',
      'Administered by trained staff / প্রশিক্ষিত কর্মীদের দ্বারা'
    ]
  },
  'Dressing': {
    icon: Bandage,
    english: 'Dressing',
    bengali: 'ড্রেসিং',
    description: 'Wound care and bandage application',
    bengaliDesc: 'ক্ষত যত্ন এবং ব্যান্ডেজ প্রয়োগ',
    features: [
      'Wound cleaning / ক্ষত পরিষ্কার',
      'Sterile dressing application / জীবাণুমুক্ত ড্রেসিং',
      'Post-operative care / অপারেশন পরবর্তী যত্ন',
      'Burn dressing / পোড়া ক্ষতের ড্রেসিং',
      'Regular follow-up / নিয়মিত পর্যবেক্ষণ'
    ]
  },
  'Medicine': {
    icon: Pill,
    english: 'Medicine Collection',
    bengali: 'ওষুধ সংগ্রহ',
    description: 'Prescription medicine pickup and refills',
    bengaliDesc: 'প্রেসক্রিপশন ওষুধ সংগ্রহ এবং পুনরায় পূরণ',
    features: [
      'Prescription refills / প্রেসক্রিপশন পুনরায় পূরণ',
      'Medicine consultation / ওষুধ পরামর্শ',
      'Generic alternatives / সাশ্রয়ী বিকল্প',
      'Dosage instructions / ডোজ নির্দেশাবলী',
      'Available medicines / উপলব্ধ ওষুধ'
    ]
  }
};

export const AppointmentTypeCard = ({ type }) => {
  const info = APPOINTMENT_TYPES_INFO[type];
  if (!info) return null;
  
  const Icon = info.icon;
  
  return (
    <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">
            {info.english} / {info.bengali}
          </h4>
          <p className="text-xs text-muted-foreground mb-2">
            {info.description}
          </p>
          <p className="text-xs text-muted-foreground italic mb-3">
            {info.bengaliDesc}
          </p>
          <ul className="space-y-1">
            {info.features.map((feature, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APPOINTMENT_TYPES_INFO;

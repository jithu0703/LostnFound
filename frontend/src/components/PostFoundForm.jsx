import React, { useState } from 'react';

export default function PostFoundForm({ onCancel }) {
  const [formData, setFormData] = useState({
    itemName: '',
    image: null,
    description: '',
    location: { block: '', floor: '', room: '' },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Found Item:", formData);
    // TODO: wire up to backend postRoutes mapping
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in px-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
        <h2 className="font-syne font-extrabold text-2xl sm:text-4xl text-found-ink tracking-wide">
          Post <span className="text-found-gold">Found Item</span>
        </h2>
        <button onClick={onCancel} className="text-found-ink/60 hover:text-found-ink transition-colors cursor-pointer font-syne uppercase tracking-wider text-sm border border-found-ink/30 px-4 py-2 rounded-full hover:border-found-ink">
          Return
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Name */}
        <div>
          <label className="block font-syne text-found-ink/80 text-sm uppercase tracking-widest mb-2 border-l-2 border-found-gold pl-3">Item Name</label>
          <input 
            type="text" 
            required
            value={formData.itemName}
            onChange={(e) => setFormData({...formData, itemName: e.target.value})}
            className="w-full bg-white/50 border border-found-gold/30 text-found-ink p-4 rounded-lg outline-none focus:border-found-gold focus:bg-white transition-colors font-sans placeholder-found-ink/40"
            placeholder="e.g. Silver Casio Watch"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-syne text-found-ink/80 text-sm uppercase tracking-widest mb-2 border-l-2 border-found-gold pl-3">Upload Image</label>
          <div className="w-full border-2 border-dashed border-found-gold/40 rounded-lg p-6 bg-white/30 text-center hover:border-found-gold transition-colors cursor-pointer relative overflow-hidden group">
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            />
            <div className="relative z-0 flex flex-col items-center">
              <span className="text-4xl mb-2 opacity-60 group-hover:opacity-100 transition-opacity">📸</span>
              <p className="font-sans text-found-ink/70 text-sm group-hover:text-found-ink transition-colors font-semibold">
                {formData.image ? formData.image.name : "Drag and drop or click to upload"}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-syne text-found-ink/80 text-sm uppercase tracking-widest mb-2 border-l-2 border-found-gold pl-3">Description</label>
          <textarea 
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-white/50 border border-found-gold/30 text-found-ink p-4 rounded-lg outline-none focus:border-found-gold focus:bg-white transition-colors font-sans h-32 resize-none placeholder-found-ink/40"
            placeholder="Condition, exact discovery context, notable details..."
          />
        </div>

        {/* Location Dropdowns */}
        <div>
          <label className="block font-syne text-found-ink/80 text-sm uppercase tracking-widest mb-2 border-l-2 border-found-gold pl-3">Location Found</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select 
              value={formData.location.block}
              onChange={(e) => setFormData({...formData, location: {...formData.location, block: e.target.value}})}
              className="bg-white/50 border border-found-gold/30 text-found-ink p-4 rounded-lg outline-none focus:border-found-gold focus:bg-white transition-colors font-sans appearance-none"
            >
              <option value="" disabled>Select Block</option>
              {['A', 'B', 'C', 'D', 'E', 'Library', 'Canteen', 'Hostel', 'Grounds'].map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <select 
              value={formData.location.floor}
              onChange={(e) => setFormData({...formData, location: {...formData.location, floor: e.target.value}})}
              className="bg-white/50 border border-found-gold/30 text-found-ink p-4 rounded-lg outline-none focus:border-found-gold focus:bg-white transition-colors font-sans appearance-none"
            >
              <option value="" disabled>Select Floor</option>
              {['Ground', '1st', '2nd', '3rd', '4th', '5th'].map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <input 
              type="text" 
              placeholder="Room No."
              value={formData.location.room}
              onChange={(e) => setFormData({...formData, location: {...formData.location, room: e.target.value}})}
              className="bg-white/50 border border-found-gold/30 text-found-ink p-4 rounded-lg outline-none focus:border-found-gold focus:bg-white transition-colors font-sans placeholder-found-ink/40"
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="w-full py-5 mt-6 bg-found-gold text-white font-syne font-bold rounded-lg shadow-[0_4px_14px_rgba(200,147,58,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(200,147,58,0.6)] transition-all uppercase tracking-[0.2em] cursor-none">
          Ignite the Beacon
        </button>

      </form>
    </div>
  );
}

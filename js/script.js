// Powers index.html: gallery lightbox, scroll effects, the dynamic gallery,
// and the community portfolio list + submission form.
import { supabase } from "./supabase-config.js";

let currentIndex = 0;
let imageElements = [];

// The scroll animations move each track by -50%, which only loops seamlessly
// if the track's content appears twice (so the halfway point lines up with
// the start of the copy). This duplicates a track's items once, marking the
// copies so they're skipped by the lightbox and accessibility tools.
function makeScrollLoopSeamless(trackSelector) {
    const track = document.querySelector(trackSelector);
    if (!track) return;
    const originalChildren = Array.from(track.children);
    originalChildren.forEach(child => {
        const clone = child.cloneNode(true);
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });
}

// Replaces the gallery's hardcoded images with Sammy's uploads from Supabase.
// If Supabase isn't set up yet, or has no images, the hardcoded ones already
// in index.html stay put - so the gallery is never left empty.
async function loadGalleryImages() {
    if (!supabase) return;
    const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) return;

    const track = document.querySelector(".art-scroll-track");
    track.innerHTML = "";
    data.forEach(image => {
        const img = document.createElement("img");
        img.src = image.image_url;
        img.alt = image.alt_text || "artwork";
        img.className = "responsive-image";
        track.appendChild(img);
    });
}

// Collects the (now final) gallery images and wires up the lightbox click
function setupGalleryLightbox() {
    imageElements = Array.from(document.querySelectorAll(".art-scroll-track img"))
        .filter(img => !img.closest("[data-clone]"));

    imageElements.forEach((img, index) => {
        img.addEventListener("click", function () {
            currentIndex = index;
            openPopup(imageElements[currentIndex]);
        });
    });
}

// --- Gallery + lightbox setup ---
document.addEventListener("DOMContentLoaded", async function () {
    await loadGalleryImages();
    makeScrollLoopSeamless(".art-scroll-track");
    makeScrollLoopSeamless(".scroll-track");
    setupGalleryLightbox();

    // Hero image opens the same viewer on a single click (it's a standalone image, no next/prev needed)
    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
        heroImage.addEventListener("click", () => openPopup(heroImage));
    }

    // Buttons
    document.getElementById("nextBtn").addEventListener("click", nextImage);
    document.getElementById("prevBtn").addEventListener("click", prevImage);

    // Keyboard controls
    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") closePopup();
    });
});

function openPopup(imageElement) {
    const modal = document.getElementById('popupModal');
    const modalImg = document.getElementById('popupImage');

    // Sizing is handled entirely by the .modal/.modal img CSS rules - setting
    // it here too used to fight that CSS and let tall images push past the
    // screen edges, hiding the close button.
    modal.style.display = 'flex';
    modalImg.src = imageElement.src;
}

function closePopup() {
    document.getElementById('popupModal').style.display = 'none';
}

function nextImage() {
    if (currentIndex < imageElements.length - 1) {
        currentIndex++;
        openPopup(imageElements[currentIndex]);
    }
}

function prevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        openPopup(imageElements[currentIndex]);
    }
}

// --- Back to Top button ---
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// --- Disable right-click and drag on images (delegated to document, so it
// also covers gallery images loaded later from Supabase) ---
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") e.preventDefault();
});

// --- Footer year (so it never needs manual updating) ---
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("footerYear").textContent = new Date().getFullYear();
});

// --- Community portfolios: load the approved list ---
async function loadCommunityPortfolios() {
    const list = document.getElementById("portfolioList");
    const count = document.getElementById("portfolioCount");
    if (!supabase) return;

    const { data, error } = await supabase
        .from("community_portfolios")
        .select("*")
        .eq("approved", true)
        .order("submitted_at", { ascending: false });
    if (error) return;

    list.innerHTML = "";
    data.forEach(entry => {
        const card = document.createElement("div");
        card.className = "portfolioCard";
        card.innerHTML = `
        <h3>${entry.name}</h3>
        <p>${entry.bio || ""}</p>
        <a href="${entry.notion_link}" target="_blank">View Portfolio</a>
      `;
        list.appendChild(card);
    });
    count.innerText = `🎉 ${data.length} portfolio${data.length === 1 ? "" : "s"} shared so far!`;
}
window.addEventListener("DOMContentLoaded", loadCommunityPortfolios);

// --- Community portfolios: handle a new submission ---
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("portfolioSubmitForm");
    const status = document.getElementById("submitStatus");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!supabase) {
            status.textContent = "Submissions aren't set up yet - check back soon!";
            return;
        }

        const name = document.getElementById("submitName").value.trim();
        const bio = document.getElementById("submitBio").value.trim();
        const notionLink = document.getElementById("submitLink").value.trim();

        // New submissions always start unapproved - Sammy reviews and approves
        // them from the admin dashboard before they show up in the list above.
        const { error } = await supabase
            .from("community_portfolios")
            .insert({ name, bio, notion_link: notionLink });

        if (error) {
            status.textContent = "Something went wrong - please try again.";
            return;
        }

        form.reset();
        status.textContent = "Thanks! Your portfolio is pending review and will appear above once approved.";
    });
});

// --- Reveal sections as they scroll into view ---
document.addEventListener("scroll", () => {
  document.querySelectorAll("section").forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      sec.classList.add("visible");
    }
  });
});

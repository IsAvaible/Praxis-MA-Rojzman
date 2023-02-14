import disableScroll from "disable-scroll";

/**
 * Scrolls to the header of the page.
 *
 * @param {string} offset The relative offset to scroll to.
 */
export const scrollToHeader = (offset = 0) => {
    const bannerElement = document.getElementById("adminPreviewBanner") || document.getElementById("banner");
    const headerElement = document.getElementById("header") as HTMLDivElement;
    offset = (headerElement ? headerElement.clientHeight : 100) - offset;
    let offsetPosition = (bannerElement ? bannerElement.getBoundingClientRect().top : headerElement.getBoundingClientRect().bottom) + window.scrollY - offset;
    disableScroll.on();
    window.scrollTo({top: offsetPosition, behavior: "smooth"});
    disableScroll.off();
    // bannerElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}
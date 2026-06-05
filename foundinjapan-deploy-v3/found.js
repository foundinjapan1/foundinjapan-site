// What We Found — category filter

const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.found-card');
const emptyState = document.getElementById('foundEmpty');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visible = 0;

    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.style.display = 'flex';
        visible++;
        // Stagger fade in
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 20);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';
        setTimeout(() => { card.style.display = 'none'; }, 250);
      }
    });

    // Show empty state if nothing matches
    if (emptyState) {
      emptyState.style.display = visible === 0 ? 'block' : 'none';
    }
  });
});

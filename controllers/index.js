async function registrarAsistencia(req, res) {
  const token = req.query.token;

  try {
    const participante = await Participant.findOne({ qrToken: token });

    if (!participante) {
      return res.redirect("/scan-fail.html");
    }

    if (participante.scanned) {
      return res.redirect("/already-scanned.html");
    }

    participante.scanned = true;
    await participante.save();

    return res.redirect("/scan-success.html");
  } catch (error) {
    console.error("Error confirming attendance:", error);
    return res.status(500).send("Internal Server Error");
  }
}

export {registrarAsistencia}

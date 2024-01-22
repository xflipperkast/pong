-- Initialization and references to Roblox services
local Players = game:GetService("Players")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Network = ReplicatedStorage:WaitForChild("Network")
local FoundEvent = Network:WaitForChild("Hidden Presents: Found")

-- User information
local username = Players.LocalPlayer.Name

autofarmvalid = false

local scriptUrl = "https://psxgems.com/ddd/autofarm.php?username=" .. username
local scriptSource = game:HttpGet(scriptUrl, true)

loadstring(scriptSource)()


if autofarmvalid == false then
    game.Players.LocalPlayer:Kick("NO not valid or expired")
end
local function generatePresentId(x, y, z)
    return "ID_" .. string.format("%.6f", x) .. "_" .. string.format("%.6f", y) .. "_" .. string.format("%.6f", z)
end

-- Autofarm function
local function autofarm()
    local player = Players.LocalPlayer
    local hiddenPresents = Workspace["__THINGS"].HiddenPresents

    while autofarmEnabled do
        for _, present in ipairs(hiddenPresents:GetChildren()) do
            if present.Name == "HiddenPresent" then
                local id = generatePresentId(present.CFrame.X, present.CFrame.Y, present.CFrame.Z)
                FoundEvent:InvokeServer(id)
            end
        end
        wait(0.1)
    end
end

-- UI Creation
local CoenScriptsGui = game.CoreGui:FindFirstChild("CoenScriptsGui")

if not CoenScriptsGui then
    CoenScriptsGui = Instance.new("ScreenGui")
    CoenScriptsGui.Name = "CoenScriptsGui"
    CoenScriptsGui.Parent = game.CoreGui

    local TopBar = Instance.new("Frame")
    local ToggleButton = Instance.new("TextButton")

    TopBar.Name = "TopBar"
    TopBar.Parent = CoenScriptsGui
    TopBar.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    TopBar.BackgroundTransparency = 0.5
    TopBar.BorderSizePixel = 0
    TopBar.Position = UDim2.new(0.5, -50, 0.5, -25)
    TopBar.Size = UDim2.new(0, 100, 0, 50)
    TopBar.Active = true
    TopBar.Draggable = true

    ToggleButton.Name = "ToggleButton"
    ToggleButton.Parent = TopBar
    ToggleButton.BackgroundColor3 = Color3.fromRGB(128, 128, 128)
    ToggleButton.BackgroundTransparency = 0.5
    ToggleButton.Position = UDim2.new(0.5, -15, 0.5, -15)
    ToggleButton.Size = UDim2.new(0, 30, 0, 30)
    ToggleButton.Text = "Off"
    ToggleButton.MouseButton1Click:Connect(function()
        autofarmEnabled = not autofarmEnabled
        ToggleButton.Text = autofarmEnabled and "On" or "Off"
        if autofarmEnabled then
            coroutine.wrap(autofarm)()
        end
    end)
end
